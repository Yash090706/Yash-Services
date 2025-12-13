import React, { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, divIcon, point } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { JourneyStart } from "../Redux/JourneySlice";
import L from "leaflet";

const GoogleMaps = () => {
  const { rid } = useParams();
  const dispatch = useDispatch();

  const wsRef = useRef(null);
  const watchIdRef = useRef(null);
  const timerRef = useRef(null);

  const [Ucoord, setUcoord] = useState(null);
  const [Wcoord, setWcoord] = useState(null);

  const [distanceKm, setDistanceKm] = useState(0);
  const [remainingSec, setRemainingSec] = useState(0);
  const [initialSec, setInitialSec] = useState(0);

  const [journeyStatus, setJourneyStatus] = useState("IDLE"); // 👈 important
  const [address, setAddress] = useState("");

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

  // ---------------- FETCH CUSTOMER ----------------
  useEffect(() => {
    const fetchCustomer = async () => {
      const res = await axios.get(
        `http://localhost:8000/yash-services/services/j-address/${rid}`
      );

      dispatch(JourneyStart(res.data));

      const { u_add } = res.data.address_info;
      setAddress(u_add);

      const geo = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${u_add}`
      );
      const data = await geo.json();

      setUcoord([+data[0].lat, +data[0].lon]);
    };

    fetchCustomer();
  }, [rid, dispatch]);

  // ---------------- WEBSOCKET + LIVE LOCATION ----------------
  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:8000");

    wsRef.current.onopen = () => {
      wsRef.current.send(JSON.stringify({ type: "WORKER_JOIN", rid }));
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setWcoord(coords);

        wsRef.current?.send(
          JSON.stringify({
            type: "WORKER_LOCATION",
            rid,
            lat: coords[0],
            lng: coords[1],
          })
        );
      },
      console.error,
      { enableHighAccuracy: true }
    );

    return () => {
      navigator.geolocation.clearWatch(watchIdRef.current);
      wsRef.current?.close();
      clearInterval(timerRef.current);
    };
  }, [rid]);

  // ---------------- DISTANCE CALC ----------------
  useEffect(() => {
    if (!Ucoord || !Wcoord) return;

    const meters = L.latLng(Wcoord).distanceTo(L.latLng(Ucoord));
    const km = meters / 1000;
    const minutes = (km / 30) * 60;
    const seconds = Math.floor(minutes * 60);

    setDistanceKm(km);

    if (journeyStatus === "IDLE") {
      setRemainingSec(seconds);
      setInitialSec(seconds);
    }
  }, [Ucoord, Wcoord, journeyStatus]);

  // ---------------- COUNTDOWN ----------------
  useEffect(() => {
    if (journeyStatus !== "RUNNING") return;

    timerRef.current = setInterval(() => {
      setRemainingSec((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setJourneyStatus("ENDED");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [journeyStatus]);

  // ---------------- BUTTON HANDLERS ----------------
  const startJourney = () => setJourneyStatus("RUNNING");

  const pauseJourney = () => {
    clearInterval(timerRef.current);
    setJourneyStatus("PAUSED");
  };

  const endJourney = () => {
    clearInterval(timerRef.current);
    setRemainingSec(0);
    setJourneyStatus("ENDED");
  };

  const min = Math.floor(remainingSec / 60);
  const sec = remainingSec % 60;

  const linePositions = Ucoord && Wcoord ? [Wcoord, Ucoord] : null;

  return (
    <div className="pl-10 pr-10">
      {/* INFO PANEL */}
      {Ucoord && Wcoord && (
        <div className="bg-slate-200 p-3 rounded-lg mb-2 text-center font-mono">
          <p><b>Customer:</b> {address}</p>
          <p><b>Distance:</b> {distanceKm} km</p>
          <p><b>Remaining Time:</b> {min}:{sec.toString().padStart(2, "0")}</p>

          <div className="flex justify-center gap-3 mt-2">
            <button onClick={startJourney} disabled={journeyStatus === "RUNNING"}
              className="bg-green-500 px-3 py-1 rounded text-white">
              Start
            </button>

            <button onClick={pauseJourney} disabled={journeyStatus !== "RUNNING"}
              className="bg-yellow-500 px-3 py-1 rounded text-white">
              Pause
            </button>

            <button onClick={endJourney}
              className="bg-red-500 px-3 py-1 rounded text-white">
              End
            </button>
          </div>
        </div>
      )}

      <MapContainer
        center={Wcoord || [19.0566, 72.9108]}
        zoom={13}
        style={{ height: "80vh", width: "100%" }}
      >
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
