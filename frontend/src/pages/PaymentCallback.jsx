import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyPayment } from "../services/api";
import "./PaymentCallback.css";

function PaymentCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "Verifying your payment..."
  );

  useEffect(() => {
    async function verify() {
      const reference = searchParams.get("reference");

      if (!reference) {
        setStatus("error");
        setMessage(
          "No payment reference was found."
        );
        return;
      }

      try {
        const result = await verifyPayment(reference);

        if (
          result.success &&
          result.paymentStatus === "Paid"
        ) {
          localStorage.setItem(
            "luxecartLastOrderId",
            String(result.orderId)
          );

          setStatus("success");
          setMessage(
            "Payment successful. Your order has been confirmed."
          );

          setTimeout(() => {
            navigate(
              `/track-order/${result.orderId}`
            );
          }, 1800);
        } else {
          setStatus("failed");
          setMessage(
            "Payment was not completed. Your order remains unpaid."
          );
        }
      } catch (error) {
        console.error(
          "Payment verification failed:",
          error
        );

        setStatus("error");
        setMessage(
          "We could not verify your payment. Please contact LUXECART support."
        );
      }
    }

    verify();
  }, [navigate, searchParams]);

  return (
    <main className="payment-callback-page">
      <div
        className={`payment-callback-card ${status}`}
      >
        {status === "verifying" && (
          <div className="payment-spinner"></div>
        )}

        {status === "success" && (
          <div className="payment-icon">✓</div>
        )}

        {(status === "failed" ||
          status === "error") && (
          <div className="payment-icon">!</div>
        )}

        <p className="payment-callback-label">
          LUXECART PAYMENT
        </p>

        <h1>
          {status === "verifying"
            ? "Verifying Payment"
            : status === "success"
            ? "Payment Successful"
            : "Payment Issue"}
        </h1>

        <p className="payment-callback-message">
          {message}
        </p>

        {status !== "verifying" && (
          <button
            type="button"
            onClick={() =>
              navigate(
                status === "success"
                  ? "/"
                  : "/checkout"
              )
            }
          >
            {status === "success"
              ? "Continue Shopping"
              : "Return to Checkout"}
          </button>
        )}
      </div>
    </main>
  );
}

export default PaymentCallback;