import React, { useEffect, useState, useRef } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./dashboard.css";


const COLORS = ["#52c41a","#e90e12d3", "#cf7713", "#510d9e"];

const LazyChartBox = ({ children, title }) => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px 100px 0px" }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="chartBox" data-scroll-animate>
      <h3>{title}</h3>
      {inView ? (
        children
      ) : (
        <div style={{ width: "100%", height: 250 }} />
      )}
    </div>
  );
};

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_TRANSACTIONS_API_URL}?page=${page}&limit=${limit}`
        );
        const data = await res.json();

        setTransactions(data.data || []);
        setTotalPages(Math.ceil((data.total || 100) / limit));
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [page, limit]);

  const filtered = transactions.filter(
    (t) =>
      t.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      t.email?.toLowerCase().includes(search.toLowerCase())
  );

  const success = filtered.filter((t) => t.status === "success");
  const failed = filtered.filter(
    (t) => t.status === "failed" || t.status === "pending"
  );

  const volume = success.reduce((a, b) => a + Number(b.amount || 0), 0);

  const maskCard = (c = "") => {
    const str = String(c);
    return str.slice(0, 6) + "******" + str.slice(-4);
  };

  const maskCVC = () => "***";

  const pieData = [
    { name: "Success", value: success.length },
    { name: "Failed", value: failed.length },
  ];
  const lineData = filtered.map((t, i) => ({
    name: i + 1,
    amount: Number(t.amount || 0),
  }));

const currencyData = [
  {
    name: "INR",
    value: filtered.filter((t) => t.currency === "INR").length,
  },
  {
    name: "USD",
    value: filtered.filter((t) => t.currency === "USD").length,
  },
  {
    name: "EUR",
    value: filtered.filter((t) => t.currency === "EUR").length,
  },
  {
    name: "GBP",
    value: filtered.filter((t) => t.currency === "GBP").length,
  },
];

const getCurrencySymbol = (currency) => {
  switch (currency) {
    case "INR":
      return "₹";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    default:
      return "";
  }
};

return (
    <div className="layout">
      <div className="main">
        <div className="topbar">
          <h2>Dashboard</h2>
          <input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="cards">
          <div className="card" data-scroll-animate>
            <h4>Total Transaction</h4>
            <h2>₹{volume.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
          </div>

          <div className="card" data-scroll-animate>
            <h4>Success Count</h4>
            <h2>{success.length}</h2>
          </div>

          <div className="card" data-scroll-animate>
            <h4>Failed Count(incl.Pending)</h4>
            <h2>{failed.length}</h2>
          </div>
          
          <div className="card" data-scroll-animate>
            <h4>Page</h4>
            <h2>{page}</h2>
          </div>
        </div>

        <div className="charts">
          <LazyChartBox title="Status Breakdown">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  cornerRadius={4}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </LazyChartBox>
          
          <LazyChartBox title="Currency Distribution">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={currencyData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  cornerRadius={4}
                  label
                >
                  {currencyData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </LazyChartBox>

          <LazyChartBox title="Volume Trend">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#2563eb" />
              </LineChart>
            </ResponsiveContainer>
          </LazyChartBox>
        </div>

        <div className="tableBox" data-scroll-animate>
          {loading ? (
            <div className="loaderWrapper">
              <div className="loader"></div>
              <p>Loading Data...</p>
            </div>
            
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Card Number</th>
                  <th>Email</th>
                  <th>Expiry Month& Year</th>
                  <th>Card CVC</th>
                  <th>Amount</th>
                   <th>Currency</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr key={i}>
                    <td>{t.orderId}</td>
                    <td>{maskCard(t.cardNumber)}</td>
                    <td>{t.email || "N/A"}</td>
                    <td>
                      {t.expiryMonth}/{t.expiryYear}
                    </td>
                    <td>{maskCVC(t.cardCVC)}</td>
                   <td>{getCurrencySymbol(t.currency)}{Number(t.amount).toFixed(2)}</td>
                    <td>{t.currency}</td>
                    <td className={`status ${t.status}`}>
                      {t.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );

};

export default Dashboard;