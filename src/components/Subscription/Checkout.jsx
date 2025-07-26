import React from "react";
import { useSearchParams } from "react-router-dom";

export const Checkout = () => {

  const [searchParam] = useSearchParams();
  const plan = searchParam.get('plan')

  return (
    <div>
      <h1>Checkout Page</h1>
      <p>Selected plan: <strong>{plan || 'None'}</strong></p>
    </div>
  );
};
