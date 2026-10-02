import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { support } from "../data/portfolio";
import { External, PageLinks, Title } from "../components/Shared";
import Icon from "../components/Icon";
const networks: Record<string, string[]> = {
  USDT: ["Ethereum", "Polygon", "Tron"],
  BTC: ["Bitcoin"],
  ETH: ["Ethereum", "Arbitrum"],
  SOL: ["Solana"],
  AVAX: ["C-Chain"],
};
export default function Support() {
  const [coin, setCoin] = useState("USDT");
  const [network, setNetwork] = useState("Ethereum");
  const [qr, setQr] = useState(false);
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");
  const wallet = support.wallets[coin + ":" + network];
  async function copy(value: string | null | undefined, label: string) {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setError("");
    } catch {
      setError("Could not copy. Select and copy the value manually.");
    }
  }
  return (
    <div className="support-layout secondary-page">
      <Title level={1}>/support</Title>
      <p className="support-description">
        If my work has helped you, here's how to support it.
      </p>
      <section className="support-section">
        <h2 className="support-section-title">Quick Support</h2>
        <p className="support-section-desc">
          A little support goes a long way.
        </p>
        <div className="support-quick-grid">
          {[
            {
              label: "PayPal",
              key: "paypal",
              icon: "paypal",
              desc: "One-time gift via PayPal",
            },
            {
              label: "Buy Me a Coffee",
              key: "coffee",
              icon: "coffee",
              desc: "Fuel my late-night builds",
            },
            {
              label: "GitHub Sponsors",
              key: "sponsors",
              icon: "github",
              desc: "Recurring support on GitHub",
            },
          ].map((s) => {
            const url = support[s.key as "paypal" | "coffee" | "sponsors"];
            const content = (
              <>
                <span className="support-quick-icon">
                  <Icon name={s.icon} />
                </span>
                <span className="support-quick-label">{s.label}</span>
                <span className="support-quick-subtext">
                  {url ? s.desc : "Coming soon"}
                </span>
              </>
            );
            return (
              <div className="support-quick-card-wrap" key={s.key}>
                {url ? (
                  <External href={url} className="support-quick-card">
                    {content}
                  </External>
                ) : (
                  <div className="support-quick-card unavailable">
                    {content}
                  </div>
                )}
                <button
                  className="support-quick-copy"
                  aria-label={"Copy " + s.label + " link"}
                  disabled={!url}
                  onClick={() => copy(url, s.label)}
                >
                  <Icon name={copied === s.label ? "check" : "link"} />
                </button>
              </div>
            );
          })}
        </div>
      </section>
      <section className="support-section">
        <h2 className="support-section-title">UPI (India)</h2>
        <p className="support-section-desc">
          Instant transfers for supporters in India.
        </p>
        <div className="support-upi-row">
          <span className="support-upi-icon">₹</span>
          <span className="support-upi-id">
            {support.upi || "UPI ID coming soon"}
          </span>
          <button
            className="support-copy-btn"
            aria-label="Copy UPI ID"
            disabled={!support.upi}
            onClick={() => copy(support.upi, "UPI")}
          >
            <Icon name={copied === "UPI" ? "check" : "copy"} />
          </button>
        </div>
      </section>
      <section className="support-section">
        <h2 className="support-section-title">Crypto</h2>
        <p className="support-section-desc">Pick a coin, then its network.</p>
        <div className="support-select-row support-select-row-networks">
          <label className="support-select-label">
            Coin
            <select
              className="support-select-trigger"
              value={coin}
              onChange={(e) => {
                setCoin(e.target.value);
                setNetwork(networks[e.target.value][0]);
                setQr(false);
                setCopied("");
              }}
            >
              {Object.keys(networks).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="support-select-label">
            Network
            <select
              className="support-select-trigger"
              value={network}
              onChange={(e) => {
                setNetwork(e.target.value);
                setQr(false);
                setCopied("");
              }}
            >
              {networks[coin].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="support-address-box">
          <div className="support-address-row">
            <span className="support-badge">{network}</span>
            <span className="support-address">
              {wallet || "Wallet address coming soon"}
            </span>
          </div>
          <div className="support-address-actions">
            <button
              className="support-copy-btn"
              aria-label="Copy wallet address"
              disabled={!wallet}
              onClick={() => copy(wallet, "wallet")}
            >
              <Icon name={copied === "wallet" ? "check" : "copy"} />
            </button>
            <button
              className="support-text-btn"
              disabled={!wallet}
              onClick={() => setQr(!qr)}
            >
              <Icon name="qr" />
              {qr ? "Hide QR" : "Show QR"}
            </button>
            {copied === "wallet" && (
              <span role="status" className="support-copy-status">
                Copied
              </span>
            )}
          </div>
          {qr && wallet && (
            <div className="support-qr">
              <QRCodeSVG value={wallet} size={160} />
            </div>
          )}
        </div>
      </section>
      {error && (
        <p role="alert" className="copy-error">
          {error}
        </p>
      )}
      <PageLinks next={{ to: "/projects", label: "View Projects" }} />
    </div>
  );
}
