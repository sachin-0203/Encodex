import React from "react";
import { Link } from "react-router-dom";

function CancellationRefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-justify">
      <h2 className="text-3xl font-bold text-center mb-6">Cancellation & Refund Policy</h2>
      <h5 className="text-sm text-gray-600 text-center mb-4">Last Updated: January 1, 2025</h5>

      <ol className="list-decimal pl-6 space-y-4">
        <li>
          <p>
            <span className="font-semibold text-lg">Free Plan:</span> Since the Free Plan is provided at no cost, no cancellation or refund is applicable.
          </p>
        </li>
        <li>
          <p>
            <span className="font-semibold text-lg">Paid Subscriptions:</span> Users can cancel their subscription anytime from their account settings. However, no partial or full refunds will be issued for the current billing period once payment is processed.
          </p>
        </li>
        <li>
          <p>
            <span className="font-semibold text-lg">Auto-Renewal:</span> All paid subscriptions are auto-renewed unless cancelled before the renewal date. It is your responsibility to cancel the plan in advance to avoid being charged.
          </p>
        </li>
        <li>
          <p>
            <span className="font-semibold text-lg">Technical Issues:</span> If you experience a technical error that prevents usage, please contact our support team within 48 hours. We’ll review the issue and may offer a partial or full refund depending on the situation.
          </p>
        </li>
        <li>
          <p>
            <span className="font-semibold text-lg">Disputes:</span> All refund or cancellation disputes will be handled on a case-by-case basis. You can reach us via our <span  className="text-primary font-semibold"> <Link to="/contact">Contact</Link> </span> page.
          </p>
        </li>
        <li>
          <p>
            <span className="font-semibold text-lg">Policy Updates:</span> We reserve the right to update this policy at any time. Continued use of the platform after changes indicates your acceptance of the revised terms.
          </p>
        </li>
      </ol>

      <p className="mt-6 text-center text-sm text-gray-600">
        By using Encodex, you agree to this Cancellation and Refund Policy.
      </p>
    </div>
  );
}

export default CancellationRefundPolicy;
