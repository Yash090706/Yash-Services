import React, { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, divIcon, point } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { JourneyStart } from "../Redux/JourneySlice";
import L from "leaflet";
import { io } from "socket.io-client";
import API from "../api/axios";
axios.defaults.withCredentials = true;
const GoogleMaps = () => {
  const { rid } = useParams();
  const dispatch = useDispatch();

  const { userinfo } = useSelector((state) => state.user);
  const { workerinfo } = useSelector((state) => state.worker);

  const socketRef = useRef(null);
  const watchIdRef = useRef(null);
  const timerRef = useRef(null);

  const [Ucoord, setUcoord] = useState(null);
  const [Wcoord, setWcoord] = useState(null);

  const [distanceKm, setDistanceKm] = useState(0);
  const [initialSec, setInitialSec] = useState(0);
  const [remainingSec, setRemainingSec] = useState(0);

  const [journeyStatus, setJourneyStatus] = useState("IDLE");        // worker
  const [remoteStatus, setRemoteStatus] = useState("IDLE");          // user

  const [address, setAddress] = useState("");

  /* ---------------- ICONS ---------------- */

  const workerIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/4862/4862248.png",
    iconSize: [40, 40],
  });

  const customerIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/4882/4882030.png",
    iconSize: [40, 40],
  });

  const clusterFunction = (cluster) =>
    divIcon({
      html: `<div style="display:flex;align-items:center;justify-content:center;width:50px;height:50px;background:#2e7d32;color:white;border-radius:70%">${cluster.getChildCount()}</div>`,
      iconSize: point(50, 50, true),
    });

  /* ---------------- FETCH CUSTOMER ---------------- */

  useEffect(() => {
    (async () => {
      const res = await API.get(
        `/yash-services/services/j-address/${rid}`
      );

      dispatch(JourneyStart(res.data));
      setAddress(res.data.address_info.u_add);

      const geo = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${res.data.address_info.u_add}`
      );
      const data = await geo.json();

      setUcoord([+data[0].lat, +data[0].lon]);
    })();
  }, [rid, dispatch]);

  /* ---------------- INITIAL WORKER LOCATION ---------------- */

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setWcoord([pos.coords.latitude, pos.coords.longitude]),
      console.error,
      { enableHighAccuracy: true }
    );
  }, []);

  /* ---------------- SOCKET.IO ---------------- */

  useEffect(() => {
    socketRef.current = io("https://yash-services-6.onrender.com");
    socketRef.current.emit("JOIN", { rid });

    socketRef.current.on("LOCATION", (data) => {
      setWcoord([data.lat, data.lon]);
    });

    socketRef.current.on("STATUS", (data) => {
      setRemoteStatus(data.status);
    });

    return () => socketRef.current.disconnect();
  }, [rid]);

  /* ---------------- START ---------------- */

  const startJourney = () => {
    if (journeyStatus === "RUNNING") return;

    setJourneyStatus("RUNNING");
    socketRef.current.emit("STATUS", {rid,status: "RUNNING" });

    if (remainingSec === 0) setRemainingSec(initialSec);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setWcoord([lat, lon]);
        socketRef.current.emit("LOCATION", { rid, lat, lon });
      },
      console.error,
      { enableHighAccuracy: true }
    );
  };

  /* ---------------- PAUSE ---------------- */

  const pauseJourney = () => {
    navigator.geolocation.clearWatch(watchIdRef.current);
    clearInterval(timerRef.current);
    setJourneyStatus("PAUSED");
    socketRef.current.emit("STATUS", {rid,status: "PAUSED" });
  };

  /* ---------------- END ---------------- */

  const endJourney = () => {
    navigator.geolocation.clearWatch(watchIdRef.current);
    clearInterval(timerRef.current);
    setJourneyStatus("ENDED");
    socketRef.current.emit("STATUS", {rid,status: "ENDED" });
  };

  /* ---------------- DISTANCE + ETA ---------------- */

  useEffect(() => {
    if (!Ucoord || !Wcoord) return;

    const meters = L.latLng(Wcoord).distanceTo(L.latLng(Ucoord));
    const km = meters / 1000;
    const sec = Math.floor((km / 30) * 3600);

    setDistanceKm(km);

    if (initialSec === 0) {
      setInitialSec(sec);
      setRemainingSec(sec);
    }
  }, [Ucoord, Wcoord, initialSec]);

  /* ---------------- COUNTDOWN ---------------- */

  useEffect(() => {
    if (journeyStatus !== "RUNNING") return;

    timerRef.current = setInterval(() => {
      setRemainingSec((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [journeyStatus]);

  const min = Math.floor(remainingSec / 60);
  const sec = remainingSec % 60;

  const linePositions = Ucoord && Wcoord ? [Wcoord, Ucoord] : null;

  /* ---------------- UI ---------------- */

  return (
    <div className="pl-10 pr-10">

      {/* WORKER PANEL */}
      {workerinfo && (
        <div className="bg-slate-200 p-4 rounded-lg mb-2 text-center font-mono">
          <p><b>Customer:</b> {address}</p>
          <p><b>Distance:</b> {distanceKm.toFixed(2)} km</p>
          <p><b>Time:</b> {min}:{sec.toString().padStart(2, "0")}</p>
          <p><b>Status:</b> {journeyStatus}</p>

          <div className="flex justify-center gap-3 mt-2">
            <button onClick={startJourney} className="bg-green-500 px-3 py-1 text-white rounded">Start</button>
            <button onClick={pauseJourney} className="bg-yellow-500 px-3 py-1 text-white rounded">Pause</button>
            <button onClick={endJourney} className="bg-red-500 px-3 py-1 text-white rounded">End</button>
          </div>
        </div>
      )}

      {/* USER PANEL */}
      {userinfo && (
        <div className="bg-slate-200 p-4 rounded-lg mb-2 text-center font-mono">
          <p><b>Estimated Time:</b> {min}:{sec.toString().padStart(2, "0")}</p>
          <p><b>Journey Status:</b> {remoteStatus}</p>
        </div>
      )}

      <MapContainer center={Wcoord || [19.0566, 72.9108]} zoom={13} style={{ height: "80vh" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MarkerClusterGroup iconCreateFunction={clusterFunction}>
          {Ucoord && <Marker position={Ucoord} icon={customerIcon} />}
          {Wcoord && <Marker position={Wcoord} icon={workerIcon} />}
          {linePositions && <Polyline positions={linePositions} color="red" />}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default GoogleMaps;
