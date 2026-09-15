import { useState } from "react";
import { useStoreSettings } from "../context/StoreSettingsContext";
import AdminSidebar from "./AdminSidebar";
import "./AdminSettings.css";

function AdminSettings() {
  const { settings, updateSettings } = useStoreSettings();

  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    updateSettings({
      [name]: value,
    });
  }

  function handleSave(event) {
    event.preventDefault();

    updateSettings(settings);

    setMessage("Settings saved successfully.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  }

  return (
    <div className="admin-layout">

      {/* SHARED ADMIN SIDEBAR */}

      <AdminSidebar />

      {/* MAIN CONTENT */}

      <main className="admin-main">

        <header className="admin-header">

          <div>

            <p className="admin-eyebrow">
              ADMINISTRATION
            </p>

            <h1>
              Settings
            </h1>

            <p>
              Manage your LUXECART store settings.
            </p>

          </div>

          <div className="admin-user">

            <div className="admin-avatar">
              {settings.adminName
                ? settings.adminName
                    .charAt(0)
                    .toUpperCase()
                : "A"}
            </div>

            <div>

              <strong>
                {settings.adminName}
              </strong>

              <span>
                {settings.adminRole}
              </span>

            </div>

          </div>

        </header>

        <form
          className="admin-settings"
          onSubmit={handleSave}
        >

          {/* STORE SETTINGS */}

          <div className="settings-card">

            <p className="admin-eyebrow">
              STORE SETTINGS
            </p>

            <h2>
              Store Information
            </h2>

            <div className="settings-field">

              <label>
                Store Name
              </label>

              <input
                type="text"
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
                required
              />

            </div>

            <div className="settings-field">

              <label>
                Currency
              </label>

              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
              >

                <option value="GHS - Ghana Cedi">
                  GHS - Ghana Cedi
                </option>

                <option value="USD - US Dollar">
                  USD - US Dollar
                </option>

                <option value="GBP - British Pound">
                  GBP - British Pound
                </option>

                <option value="EUR - Euro">
                  EUR - Euro
                </option>

              </select>

            </div>

            <div className="settings-field">

              <label>
                Store Status
              </label>

              <select
                name="storeStatus"
                value={settings.storeStatus}
                onChange={handleChange}
              >

                <option value="Active">
                  Active
                </option>

                <option value="Maintenance">
                  Maintenance
                </option>

                <option value="Closed">
                  Closed
                </option>

              </select>

            </div>

          </div>

          {/* ADMIN ACCOUNT */}

          <div className="settings-card">

            <p className="admin-eyebrow">
              ADMIN ACCOUNT
            </p>

            <h2>
              Administrator
            </h2>

            <div className="settings-field">

              <label>
                Administrator Name
              </label>

              <input
                type="text"
                name="adminName"
                value={settings.adminName}
                onChange={handleChange}
                required
              />

            </div>

            <div className="settings-field">

              <label>
                Role
              </label>

              <input
                type="text"
                name="adminRole"
                value={settings.adminRole}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* SAVE */}

          <div className="settings-actions">

            <button
              type="submit"
              className="settings-save-button"
            >
              Save Changes
            </button>

            {message && (
              <span className="settings-success">
                {message}
              </span>
            )}

          </div>

        </form>

      </main>

    </div>
  );
}

export default AdminSettings;