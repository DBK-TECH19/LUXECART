import { useEffect, useState } from "react";
import { getUsers } from "../services/api";
import AdminSidebar from "./AdminSidebar";
import "./AdminCustomers.css";

function AdminCustomers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getUsers();

        const usersList =
          data?.value || data || [];

        setUsers(
          Array.isArray(usersList)
            ? usersList
            : []
        );
      } catch (error) {
        console.error(
          "Unable to load customers:",
          error
        );

        setError("Unable to load customers.");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  return (
    <div className="admin-layout">

      {/* REUSABLE SIDEBAR */}

      <AdminSidebar />

      {/* MAIN CONTENT */}

      <main className="admin-main">

        <header className="admin-header">

          <div>

            <p className="admin-eyebrow">
              CUSTOMER MANAGEMENT
            </p>

            <h1>
              Customers
            </h1>

            <p>
              View the customers registered on your
              LUXECART store.
            </p>

          </div>

          <div className="admin-user">

            <div className="admin-avatar">
              A
            </div>

            <div>

              <strong>
                Administrator
              </strong>

              <span>
                Store Manager
              </span>

            </div>

          </div>

        </header>

        {/* CUSTOMER COUNT */}

        <section className="customers-count">

          <span>
            Total Customers
          </span>

          <strong>
            {loading
              ? "..."
              : users.length}
          </strong>

        </section>

        {/* CUSTOMERS TABLE */}

        <div className="customers-table-container">

          {loading ? (

            <div className="customers-state">
              Loading customers...
            </div>

          ) : error ? (

            <div className="customers-state error">
              {error}
            </div>

          ) : users.length === 0 ? (

            <div className="customers-state">

              No customers have registered yet.

            </div>

          ) : (

            <table className="customers-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Registered</th>
                </tr>

              </thead>

              <tbody>

                {users.map((user) => (

                  <tr key={user.id}>

                    <td>
                      #{user.id}
                    </td>

                    <td>
                      <strong>
                        {user.name ||
                          "Unnamed Customer"}
                      </strong>
                    </td>

                    <td>
                      {user.email ||
                        "No email"}
                    </td>

                    <td>
                      {user.phone ||
                        "Not provided"}
                    </td>

                    <td>
                      {user.address ||
                        "Not provided"}
                    </td>

                    <td>
                      {user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString(
                            "en-GH",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </main>

    </div>
  );
}

export default AdminCustomers;