import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, divIcon, point } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import axios from "axios";

import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { JourneyStart } from "../Redux/JourneySlice";
const GoogleMaps = () => {
  const { rid } = useParams();

  const dispatch=useDispatch();

  // Coordinates
  const [Ucoord, setUcoord] = useState(null); // User
  const [Wcoord, setWcoord] = useState(null); // Worker

  // Distance and estimated time
  const [distanceKm, setDistanceKm] = useState(null);
  const [timeMin, setTimeMin] = useState(null);

  // Addresses
  const [address, setAddress] = useState(null);

  // Icons
  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/4862/4862248.png",
    iconSize: [40, 40],
  });

  const customerIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/4882/4882030.png",
    iconSize: [40, 40],
  });

  const clusterFunction = (cluster) =>
    divIcon({
      html: `<div style="display:flex;align-items:center;justify-content:center;width:50px;height:50px;background:#2e7d32;color:white;border-radius:70%;font-size:20px;font-style:italic">${cluster.getChildCount()}</div>`,
      className: "cluster-icon",
      iconSize: point(50, 50, true),
    });

  // Fetch user and worker coordinates
  const fetchAddress = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/yash-services/services/j-address/${rid}`
      ).catch((err)=>{
        console.log(err)
      })

      dispatch(JourneyStart(res.data))



      const { u_add, w_add } = res.data.address_info;
      setAddress([u_add, w_add]);

      const [uRes, wRes] = await Promise.all([
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${u_add}`),
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${w_add}`),
      ]);

      const [uadd, wadd] = await Promise.all([uRes.json(), wRes.json()]);

      const ulat = parseFloat(uadd[0].lat);
      const ulon = parseFloat(uadd[0].lon);
      const wlat = parseFloat(wadd[0].lat);
      const wlon = parseFloat(wadd[0].lon);

      setUcoord([ulat, ulon]);
      setWcoord([wlat, wlon]);
    } catch (err) {
      console.error(err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAddress();
  }, [rid]);

  // Poll for updates every 5 seconds (worker may move)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAddress();
    }, 5000); // Adjust interval as needed

    return () => clearInterval(interval);
  }, [rid]);

  // Calculate distance and estimated time whenever coordinates change
  useEffect(() => {
    if (Ucoord && Wcoord) {
      const meters = L.latLng(Wcoord).distanceTo(L.latLng(Ucoord));
      const km = (meters / 1000).toFixed(2);
      const minutes = ((km / 30) * 60).toFixed(2);

      setDistanceKm(km);
      setTimeMin(minutes);
    }
  }, [Ucoord, Wcoord]);

  // Polyline positions
  const linePositions = Ucoord && Wcoord ? [Ucoord, Wcoord] : null;

  return (
    <div className="pl-15 pr-20">
      {/* Distance Info */}
      {distanceKm && timeMin && address && (
        <div className="w-[400px] font-mono ml-auto bg-slate-200 text-green-800 border-2 rounded-lg text-center mr-5 mb-2 mt-2 p-2">
          <p>
            Distance From <strong>{address[0]}</strong> To <strong>{address[1]}</strong>: {distanceKm} km
          </p>
          <p>Estimated Time: {timeMin} minutes</p>
        </div>
      )}

      <MapContainer
        center={Ucoord || [19.0566, 72.9108]}
        zoom={10}
        style={{ height: "80vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MarkerClusterGroup iconCreateFunction={clusterFunction}>
          {/* User Marker */}
          {Ucoord && (
            <Marker position={Ucoord} icon={customerIcon}>
              <Popup>User Location</Popup>
            </Marker>
          )}

          {/* Worker Marker */}
          {Wcoord && (
            <Marker position={Wcoord} icon={customIcon}>
              <Popup>Worker Location</Popup>
            </Marker>
          )}

          {/* Polyline */}
          {linePositions && (
            <Polyline positions={linePositions} color="red" weight={4}>
              <Popup>
                Route From Worker To Customer <br />
                Distance: {distanceKm} km <br />
                Estimated Time: {timeMin} min
              </Popup>
            </Polyline>
          )}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default GoogleMaps;
