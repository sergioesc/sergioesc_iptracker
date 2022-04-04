import axios from "axios";
import { useReducer } from "react";
import { useEffect } from "react";
import { useState } from "react";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "SEARCH_REQUEST":
      return { ...state, loadingSearch: true };
    case "SEARCH_SUCCESS":
      return { ...state, loadingSearch: false, ipSearch: action.payload };
    case "SEARCH_FAIL":
      return { ...state, loadingSearch: false, errorSearch: action.payload };
    default:
      return state;
  }
};

function App() {
  const [{ loading, ipSearch, error, errorSearch, loadingSearch }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [ipDirection, setIP] = useState("");
  const [value, setValue] = useState("");
  const [search, setSearch] = useState(true);

  useEffect(() => {
    dispatch({ type: "FETCH_REQUEST" });
    try {
      const getData = async () => {
        const res = await axios.get("https://geolocation-db.com/json/");
        setIP(res.data.IPv4);
        dispatch({ type: "FETCH_SUCCESS" });
      };
      getData();
    } catch (err) {
      console.log(err.message);
      dispatch({ type: "FETCH_FAIl", payload: error });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(false);
    dispatch({ type: "SEARCH_REQUEST" });
    try {
      const fetchData = async () => {
        const res = await axios.get(
          "https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/",
          {
            headers: {
              "X-RapidAPI-Host": "ip-geolocation-ipwhois-io.p.rapidapi.com",
              "X-RapidAPI-Key":
                "5f1e69948cmshbcddcfc5cba4103p1e565ejsnc5be6a57a899",
            },
            params: { ip: value },
          }
        );
        console.log(res.data);
        dispatch({ type: "SEARCH_SUCCESS", payload: res.data });
      };
      fetchData();
    } catch (err) {
      console.log(err);
      dispatch({ type: "SEARCH_FAIL", payload: err.message });
    }
  };
  return loading ? (
    <div> Cargando </div>
  ) : error ? (
    <div> Error </div>
  ) : (
    <div className="App">
      <div className="banner">
        <h2>Welcome! Your IPv4 is:</h2>
        <h1>{ipDirection}</h1>
      </div>
      <div className="search">
        <div className="search-container">
          <div className="search-inner">
            <h3>Paste here an IP to get more information </h3>
            <form onSubmit={handleSubmit} className="search-form">
              <input
                type="text"
                onChange={(e) => setValue(e.target.value)}
                placeholder="For example: 123.123.123.12"
              />
              <button type="submit">Search</button>
            </form>
          </div>
        </div>
        <div className="result-container">
          <div className="result-inner">
            {search ? (
              <div></div>
            ) : loadingSearch ? (
              <div className="result-loading">
                <div className="result-loading-inner"></div>
              </div>
            ) : errorSearch ? (
              <div className="center">Dicha IP no existe o es incorrecta</div>
            ) : (
              <div className="center result-result">
                Esta informacion es publica y se encuentra en la red
                <p><b>IP:</b> {ipSearch.ip}</p>
                <p><b>ASN:</b> {ipSearch.asn} </p>
                <p><b>City:</b> {ipSearch.city} </p>
                <p><b>Region:</b> {ipSearch.region} </p>
                <p><b>Continent:</b> {ipSearch.continent} </p>
                <p><b>Country</b> {ipSearch.country}</p>
                <p><b>ISP:</b> {ipSearch.isp} </p>
                <p><b>Type:</b> {ipSearch.type} </p>
                <p><b>Latitude:</b> {ipSearch.latitude} </p>
                <p><b>Longitude:</b> {ipSearch.longitude} </p>
                <p>
                  Open in Google Maps:
                  <a
                    href={`http://www.google.com/maps/place/${ipSearch.latitude},${ipSearch.longitude}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Click here
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
