import React, { useEffect, useState } from "react";
import { useSearchParams , Link} from "react-router-dom";
import axios from "axios";
import { HashLink } from "react-router-hash-link";
import { BadgeCheck, BadgeX, Check, ChevronLast, ChevronLeft, ChevronRight, Key, Loader2, MailPlus, ShieldPlus, Sparkle } from "lucide-react";
import { useAuth } from "@/Context/AuthContext";
import { toast } from "sonner";
import { resendVerification, updateEmail } from "@/api/userUtils";

export const Checkout = () => {
  const {user , userEmail, Isverified, accessToken} = useAuth()
  const [searchParam] = useSearchParams();
  const planName = searchParam.get('plan');
  const [plan, setPlan] = useState(null);
  const [planname, setPlanname] = useState(null);
  const [amount, setAmount] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [activeStep, setActiveStep] = useState(
    localStorage.getItem("activeStep") || "2"
  );
  const [email , setEmail] = useState(userEmail || "");
  const [number , setNumber] = useState("");
  const [loading1 , setLoading1] = useState(false);
  const [loading2 , setLoading2] = useState(false);
  



  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/plan/${planName}`);
        if (response) {
          const data = response.data;
          setPlan(data);
          setPlanname(data.name)
          setAmount(data.price)
          setTotalAmount(Math.ceil(1.18 * data.price));
        } else {
          console.log('No response data');
        }
      } catch (error) {
        console.error("Failed to fetch Plan", error);
      }
    };

    if (planName) fetchPlan();
  }, [planName]);

  useEffect(() => {
    if (userEmail) {
      setEmail(userEmail);
    }
  }, [userEmail]);

  
  const handleUpdateEmail = async ()=>{
    try{
      setLoading1(true)
      const result = await updateEmail(email,accessToken);
      toast.success(result.message);
    }
    catch(errmsg){
      toast.error(errmsg)
    }
    finally{
      setLoading1(false)
    }
  }
  
  const handleResend = async () => {
    try{
      setLoading2(true)
      const result = await resendVerification(accessToken);
      toast.success(result.message);
    }
    catch(errmsg){
      toast.error(errmsg)
    }
    finally{
      setLoading2(false);
    }
  };
  
  const handleDetails = async (e)=>{
    e.preventDefault()
    if(!email || !number){
      toast.warning('Details is missing');
      return
    }
    setActiveStep("3")
    localStorage.setItem('activeStep', '3')
  }

  const handleRazorpayPayment = async (plan, amount)=>{
    
    try{
      amount = amount*100;
      const res = await axios.post('http://localhost:5000/create_order', {plan,amount});
      const { id: order_id, amountFromServer, currency } = res.data;

      const options = {
        key : "rzp_test_R8oYhgXrWfY61C",
        amount: amountFromServer,
        currency: currency,
        name: "Encodex",
        "description": `Payment for ${plan} plan`,
        order_id: order_id,
        handler : async function(response){
          try {
            const res = await axios.post("http://localhost:5000/verify_payment", {
              ...response,
              plan,
            });

            if (res.data.success) {
              toast.success("Payment successful! Your plan is activated.");
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            toast.error("Something went wrong while verifying payment.");
          }
        },
        theme: { color: "#3399cc" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
    }
    finally{

    }
  };

  return (
    <div className="md:m-10">


      <div className="flex items-center justify-center gap-4 w-full mb-5">
        <div className="flex items-center gap-2">
          <div className="bg-secondary rounded-full p-1 flex items-center justify-center text-white">
            <Check size={20} />
          </div>
          <span className="text-sm font-medium">Plan Selected</span>
        </div>

        <div className="h-px w-10 bg-secondary" />

        <div className="flex items-center gap-2">
          <div className={`bg-secondary rounded-full p-1 flex items-center justify-center text-white ${activeStep=== "3"? " " : "px-3"}`}>
            {
              activeStep === "3"? (<Check size={20} />):(2)
            }
            
          </div>
          <span className="text-sm font-medium">User Details</span>
        </div>

        <div className="h-px w-10 bg-secondary" />

        <div className="flex items-center gap-2">
          <div className="bg-secondary rounded-full p-1 px-3 flex items-center justify-center text-white">
            3
          </div>
          <span className="text-sm font-medium">Payment</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5 p-2">
        
        <div className="border border-ring rounded-md h-[20rem] w-full md:w-[70%]  ">
          {plan ? 
            (
              <div className="p-2">
                <h2 className="mt-1 ml-1" > Plan Details</h2>
                <div className=" p-2 ml-1 rounded-md ">

                  <div className="flex justify-between text-center pt-2">
                    <div className="text-left text-lg">
                      <h2 className="font-bold text-primary" > 
                        {plan.name}
                      </h2>
                      {plan.name === "Pro" && 
                        <div className=" text-sm text-[8px]  rounded-full px-1.5 bg-secondary text-white flex items-center gap-1 ">
                        <Sparkle size={8} />
                        Most Popular
                      </div>}
                      
                    </div>
                    <h3>  
                      <span className="text-lg font-bold">
                        ₹{plan.price} 
                      </span>
                      <span className=" line-through text-sm ml-2 text-gray-600 font-semibold ">  
                        ₹{plan.price + 300} </span> 
                    </h3>
                  </div>

                  <div className="border-t border-gray-500 mt-4 pt-3">
                    <div className="mb-2" >
                      What's included:
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-sm my-1">
                        <Check size={15} className="text-secondary inline-block" />
                        <p> {plan.duration} days Validity</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm my-1">
                        <Check size={15} className="text-secondary inline-block" />
                        <p>{plan.features.downloads_per_month} Images download/month</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm my-1 ">
                        <Check size={15} className="text-secondary inline-block" />
                        <p>{plan.features.storage}+ Storage</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm my-1">
                        <Check size={15} className="text-secondary inline-block" />
                        <p> Priority Support: {plan.features.priority_support ? "Yes" : "No"}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm ">
                        <Check size={15} className="text-secondary inline-block" />
                        <p> Advanced Key Management</p>
                      </div>
                    </div>
                    
                  </div>
                </div>
                <div >
                  <HashLink to='/plus#plans' className="underline hover:text-primary capitalize text-sm ">
                    change plan
                  </HashLink>
                </div>
              </div>
            ) : 
            (
              <p className=" animate-pulse">Loading plan details...</p>
            )
          }
        </div>

        <div className="border border-ring w-full p-2 rounded-md" >
          { activeStep == "2" ? (
             <div >
              <div className="mx-1">
                <div className=" capitalize">
                  Your Details
                </div>
                <form onSubmit={handleDetails} >

                  <div className=" my-3">
                    <label htmlFor="fullname" className="ml-2">Name*</label>
                    <input value={user} type="text" name="fullname" id="fullname" className=" text-sm w-[97%] ml-2 text-black mt-1 rounded-sm border outline-ring pl-2 " disabled />
                  </div>

                  <div className=" my-3">
                    <label htmlFor="email" className="ml-2">Email*</label>
                    <div className="flex relative cursor-pointer">
                      <input value={email} onChange={(e)=>setEmail(e.target.value)} type="text" name="email" id="email" className="text-sm w-[97%] ml-2 text-black mt-1 rounded-sm  border outline-ring pl-2 " disabled={Isverified}  />
                      
                      {Isverified? (
                        ""
                      ):(
                        <>
                          <div className="absolute right-2 sm:right-3 top-1.5 text-black text-[12px] px-1 peer active:scale-95" onClick={handleUpdateEmail} disabled={loading1}>
                            {loading1? (
                              <Loader2 className="animate-spin" size={18} />
                            ):(
                              <MailPlus size={18} />
                            )}
                          </div>
                          <div className=" opacity-0 absolute right-[-15px] top-[-20px] text-white border bg-gray-700 transition-opacity ease-out duration-300 rounded-md text-sm px-2 peer-hover:opacity-100" >Update Mail </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className=" my-3">
                    <label htmlFor="number" className="ml-2">Phone Number*</label>
                    <input value={number} onChange={(e)=>{setNumber(e.target.value)}} type="Number" name="number" id="number" className="text-sm w-[97%] ml-2 text-black mt-1 rounded-sm border outline-ring pl-2  " placeholder="987 654 3210" />
                  </div>

                  <div className=" my-3">
                    <div className=" ml-2 flex items-center gap-2 text-sm">
                      Status:{" "}

                      { user? ( <> 
                          { Isverified ? 
                            (
                              <div className="flex items-center gap-1 text-green-500 ">
                                Verified
                                <BadgeCheck size={15} /> 
                              </div>

                            ) : (
                            <>
                              <div className="flex w-[90%] justify-between items-center " >
                                <div className="flex items-center gap-1 text-red-500">
                                  Not Verified
                                  <BadgeX  size={15} />
                                </div>
                                <div className="cursor-pointer  active:scale-90 " onClick={handleResend} disabled={loading2} >
                                {loading2? (
                                  <Loader2 className="animate-spin mr-1" size={16} />
                                ):(
                                  
                                  <div className="border hover:bg-accent px-1 text-sm rounded-sm">
                                    verify
                                  </div>
                                  
                                )}
                                </div>
                              </div>
                            </>
                          )}
                        </> ):(<>no status</>)
                      }

                    </div>
                  </div>

                
                  <div className="mt-5 ml-2 flex items-center text-sm" >
                    <input type="checkbox" id="terms" className="mr-2  accent-secondary" required defaultChecked />
                    <label htmlFor="terms" >
                      I agree to the{" "}
                      <Link 
                        to="/terms-and-conditions" className="text-accent-dark underline"
                        target="_blank"
                      >
                        Terms & Conditions
                      </Link>
                    </label>
                  </div>

                  <button type="submit" className={`border w-full mt-2 py-2 text-center rounded-md text-sm active:scale-95 ${!Isverified? "cursor-not-allowed ":""} `} disabled={!Isverified}>
                    Continue to Payment <ChevronRight className="inline-block ml-2" size={16} />                
                  </button>

                </form>
                
              </div>
            </div> 
          ):(
            <div>
              <div className="capitalize">
                <button 
                  onClick={() => {
                      localStorage.setItem('activeStep',2)
                      setActiveStep('2')
                    }
                  }
                  className="hover:bg-muted p-1 rounded-md "
                >
                  <ChevronLeft size={18} className="inline-block" />
                </button>
                <span className="ml-2">
                  Order Summary
                </span>
              </div>

              <div className="py-2 px-6 ">
                <div className="mb-4">
                  <p className="font-medium">Pro Plan</p>
                  <p className="text-sm text-gray-500">Lifetime Validity</p>
                </div>

                <div className="border-t border-b py-3 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      ₹{amount}
                      <span className=" line-through text-sm ml-2 text-gray-600 font-semibold ">  
                        ₹{amount + 300} 
                      </span> 
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (18%)</span>
                    <span>₹{Math.ceil(0.18*amount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-2 text-success">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>

                <button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium"
                  onClick={()=> handleRazorpayPayment(planname, totalAmount)}
                >
                  Proceed to Pay ₹{totalAmount}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  🔒 Secure payment powered by Razorpay
                </p>
              </div>
            </div>
          )}
        </div>

        
        
      </div>
    </div>
    
  );
};
