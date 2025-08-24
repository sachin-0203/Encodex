import razorpay
from flask import request, jsonify, Flask
import os
from dotenv import load_dotenv


load_dotenv()

razorpay_env = os.getenv("RAZORPAY_ENV","test")

if razorpay_env == "live":
  key_id = os.getenv("RAZORPAY_LIVE_KEY_ID")
  key_secret = os.getenv("RAZORPAY_LIVE_KEY_SECRET")
else:
  key_id = os.getenv("RAZORPAY_TEST_KEY_ID")
  key_secret = os.getenv("RAZORPAY_TEST_KEY_SECRET")

razorpay_client = razorpay.Client(auth=(key_id, key_secret))

def register_payment_routes(app):

  @app.route('/create_order', methods =['POST'])
  def create_order():
    data = request.get_json()
    plan = data.get('plan')
    amount = data.get('amount')

    order = razorpay_client.order.create({
      "amount" : amount,
      "currency" : "INR",
      "payment_capture" : "1"
    })

    return jsonify(order)

  @app.route('/verify_payment', methods=['POST'])
  def verify_payment():
    data = request.get_json()
    try:
      razorpay_client.utility.verify_payment_signature({
        'razorpay_order_id': data['razorpay_order_id'],
        'razorpay_payment_id': data['razorpay_payment_id'],
        'razorpay_signature': data['razorpay_signature']
      })
      return jsonify({
        "status": "success",
        "plan": data['plan']
      })
    except:
      return jsonify({"status": "failure"}), 400
  
