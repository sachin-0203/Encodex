import React, { useEffect, useState } from "react";
import { useSearchParams , Link} from "react-router-dom";
import axios from "axios";
import { HashLink } from "react-router-hash-link";
import { Check, ChevronLast, ChevronLeft, ChevronRight, Sparkle } from "lucide-react";
import { useAuth } from "@/Context/AuthContext";
import { toast } from "sonner";

export const Checkout = () => {
  const {user , userEmail} = useAuth()
  const [searchParam] = useSearchParams();
  const planName = searchParam.get('plan');
  const [plan, setPlan] = useState(null);
  const [activeStep, setActiveStep] = useState("2");
  const [name , setName] = useState("");
  const [email , setEmail] = useState("");
  const [number , setNumber] = useState("");


  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/plan/${planName}`);
        if (response) {
          setPlan(response.data);
        } else {
          console.log('No response data');
        }
      } catch (error) {
        console.error("Failed to fetch Plan", error);
      }
    };

    if (planName) fetchPlan();
  }, [planName]);

  const handleDetails = async (e)=>{
    e.preventDefault()
    if(!name || !email || !number){
      toast.warning('Details is missing');
      return
    }
    setActiveStep("3")
  }

  return (
    <div className="md:m-10">


      <div className="flex items-center justify-center gap-4 w-full mb-5">
        {/* Step 1 */}
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
            {/* <Check size={20} /> */}
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
                      {plan.name === "Pro" && <div className=" text-sm text-[10px] rounded-full px-2.5 bg-secondary text-white">
                        <Sparkle size={10} className="inline-block mr-1" />
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
              <p className=" ">Loading plan details...</p>
            )
          }
        </div>

        <div className="border border-ring h-[20rem] w-full p-2 rounded-md" >
          { activeStep == "2" ? (
             <div >
              <div className="mx-1">
                <div className=" capitalize">
                  Your Details
                </div>
                <form onSubmit={handleDetails} >

                    <div className=" my-3">
                      <label htmlFor="fullname" className="ml-2">Full name*</label>
                      <input value={name} onChange={(e)=>setName(e.target.value)} type="text" name="fullname" id="fullname" className=" text-sm w-[97%] ml-2 text-black mt-1 rounded-sm border outline-ring pl-2 " />
                    </div>

                    <div className=" my-3">
                      <label htmlFor="email" className="ml-2">Email*</label>
                      <input value={email} onChange={(e)=>setEmail(e.target.value)} type="text" name="email" id="email" className="text-sm w-[97%] ml-2 text-black mt-1 rounded-sm  border outline-ring pl-2 " />
                    </div>

                    <div className=" my-3">
                      <label htmlFor="number" className="ml-2">Phone Number*</label>
                      <input value={number} onChange={(e)=>{setNumber(e.target.value)}} type="Number" name="number" id="number" className="text-sm w-[97%] ml-2 text-black mt-1 rounded-sm border outline-ring pl-2  " placeholder="(+91) 987-654-3210" />
                    </div>

                  
                    <div className="mt-5 ml-2 flex items-center text-sm" >
                      <input type="checkbox" id="terms" className="mr-2 text-secondary accent-secondary" required />
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

                    <button type="submit" className="border w-full mt-2 py-2 text-center rounded-md text-sm">
                      Continue to Payment <ChevronRight className="inline-block ml-2" size={16} />                
                    </button>
                </form>
                
              </div>
            </div> 
          ):(

            <div>
              <div className="">
                <div className="capitalize">
                  <button 
                    onClick={() => setActiveStep('2')}
                    className="hover:bg-muted p-1 rounded-md "
                  >
                    <ChevronLeft size={18} className="inline-block" />
                  </button>
                  <span className="ml-2">
                    Payment Information
                  </span>
                </div>
              </div>
            </div>

          )}
        </div>

        
        
      </div>
    </div>
    
  );
};
