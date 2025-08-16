import React, {useEffect, useState} from "react";
import { Link, useNavigate} from "react-router-dom";
import { Check, X ,ChevronDown, ChevronUp, Minus, Plus, MoveUp } from "lucide-react";
import AuthModal from "../AuthModel/AuthModel";
import { useAuth } from "@/Context/AuthContext";


const faqs = [
  {
    question: "Can I use Encodex for free?",
    answer:
      "Yes! The Free plan includes basic encryption and 100MB of storage. You can upgrade to Pro or Premium anytime for more features.",
  },
  {
    question: "How secure is Encodex?",
    answer:
      "Encodex uses AES and RSA hybrid encryption to ensure your files remain secure both during upload and in storage. We do not store your encryption keys.",
  },
  {
    question: "Can I cancel or change my subscription anytime?",
    answer:
      "Yes, you can upgrade, downgrade, or cancel your subscription at any time. Your benefits will remain active until the end of the billing period.",
  },
  {
    question: "Will my files be deleted if I cancel my plan?",
    answer:
      "No, your files will remain accessible under your current limits. However, cloud backups and access to advanced features will be restricted once your plan expires.",
  },
];

const features = [
    { name: 'Image Encryption & Decryption', free: true, pro: true, premium: true },
    { name: 'Storage Limit', free: '100MB', pro: '2GB', premium: '10GB+' },
    { name: 'Upload Limit Per File', free: '5MB', pro: '20MB', premium: '100MB' },
    { name: 'Daily Encryptions', free: '3/day', pro: '20/day', premium: 'Unlimited' },
    { name: 'Encrypted File Sharing', free: true, pro: true, premium: true },
    { name: 'Cloud Backup', free: false, pro: '7 days', premium: '30 days' },
    { name: 'Access Logs', free: false, pro: true, premium: true },
    { name: 'Hybrid AES + RSA Encryption', free: true, pro: true, premium: true },
    { name: 'Multi-Device Access', free: false, pro: true, premium: true },
    { name: 'Support', free: 'Community', pro: 'Email', premium: '24/7 Priority' },
  ];

export const EncodexPlus = () => {

  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [authView, setAuthView] = useState("login");
  const {accessToken} = useAuth();
  const navigate = useNavigate();

  const handlefreeClick = (viewElement)=>{
    if(accessToken){
      navigate('/dashboard')
    }
    else{
      setAuthView(viewElement);
      setShowModal(true);
    }
  }

  const handlePaidClick = (viewElement, planName)=>{
    if(accessToken){
      window.open(`/checkout?plan=${planName}`, '_blank', 'noopener,noreferrer');
    }
    else{
      setAuthView(viewElement);
      setShowModal(true);
    }
  }

  useEffect(()=>{
    setShowModal(false)
  },[accessToken])

  useEffect(()=>{
    const handleScroll = ()=>{
      if(window.scrollY > 100){
      setVisible(true)
      }
      else{
        setVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll);
    return ()=> window.removeEventListener('scroll', handleScroll);
  }, [])
  
  const scrollToTop = ()=>{
		window.scrollTo({
			top:0,
			behavior: 'smooth',
		});
	};

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  const Tick = () => <Check className="text-green-600 w-5 h-5 mx-auto" />;
  const Cross = () => <X className="text-red-500 w-5 h-5 mx-auto" />;
  

  return (
    <>


      {/* Banner */}
      <section className="relative bg-signup py-10 px-4 md:px-8 sm:rounded-3xl rounded-lg ">
        <AuthModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          defaultView={authView}
        />
        <div className="text-3xl md:text-start text-center text-white">
          <h1 className=" uppercase ">Encode<span className="text-red-500" >x</span> </h1>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          
          {/* Text Content */}
          <div className="order-2 sm:order-1">
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4 text-center md:text-start">
              Unlock More Power With<br />
              <span className="text-primary">One Subscription</span>
            </h1>

            <p className="text-md text-white/80 mb-6 text-center md:text-start">
              Get access to faster encryption, cloud backup, file sharing, and powerful hybrid security with Encodex Plus.
            </p>

            <div className="text-center md:text-start">
              <button onClick={() => {
                  document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-block bg-primary hover:bg-secondary text-white text-lg font-medium py-3 px-6 rounded-lg transition duration-300 scroll-smooth"
              >
                Explore Plans
              </button >
            </div>
            
            
          </div>

          {/* Illustration */}
          <div className=" order-1 flex justify-center min-h-[5rem]">
            <img
              src="assets/image.svg" 
              alt="Encryption illustration"
              className="max-w-full w-full h-[25em]"
            />
          </div>
        </div>

        <button id="moveTop" onClick={scrollToTop} 
          className={`fixed z-20 bottom-[1rem] right-[1rem] bg-primary/90 text-white p-2 rounded-full h-16 border hover:bg-primary transition-opacity duration-400 ${visible? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        >
					<MoveUp size={20} />
				</button>

      </section>

      {/* Plans */}
      <section id="plans" className=" pt-[6rem] mt-10 "   >

        <div className="text-2xl  sm:text-4xl  text-center mb-10 text-primary font-bold">
          Our Plans
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 pb-12">

          {/* Free Plan */}
          <div className="border p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">Basic <sup className="text-red-white bg-red-700 p-1 rounded-full">Free</sup></h2>
            <p className="mt-2 text-2xl font-bold">₹0<span className="text-sm">/mo  </span></p>
            <ul className="mt-4 space-y-2 text-sm ">
              <li>🔐 Image encryption & decryption</li>
              <li>🗂 100MB secure storage</li>
              <li>📄 Upload limit: 5MB/file</li>
              <li>📅 3 encryptions per day</li>
              <li>📤 No sharing support</li>
              <li>❌ No cloud backup</li>
              <li>👥 Single device access</li>
            </ul>
            <button 
              className="mt-6 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700" 
              onClick={()=> handlefreeClick('login')}
            >
              Get Started 
            </button>
            
          </div>

          {/* Pro Plan */}
          <div className="relative border-2 border-primary p-6 rounded-2xl shadow-lg">
            <div className="absolute right-3 top-3 rounded-sm  text-center bg-secondary px-3 text-white w-fit text-sm">
              Popular
            </div>
            <h2 className="text-xl font-semibold text-">Pro</h2>
            <p className="mt-2 text-2xl font-bold">₹199<span className="text-sm">/year</span></p>
            <ul className="mt-4 space-y-2 text-sm ">
              <li>🔐 Image encryption & decryption</li>
              <li>🗂 2GB secure storage</li>
              <li>📄 Upload limit: 20MB/file</li>
              <li>📅 20 encryptions per day</li>
              <li>🔗 Encrypted file sharing</li>
              <li>☁️ 7-day cloud backup</li>
              <li>📲 Multi-device access</li>
              <li>📞 Email support</li>
            </ul>
            <button 
              className="mt-6 bg-primary text-white py-2 px-4 rounded hover:bg-primary/55" 
              onClick={()=> handlePaidClick('login','Pro')}
              >Subscribe</button>
          </div>

          {/* Premium Plan */}
          <div className="border p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">Premium</h2>
            <p className="mt-2 text-2xl font-bold">₹499<span className="text-sm">/year</span></p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>🔐 All Pro features included</li>
              <li>🗂 10GB+ storage</li>
              <li>📄 Upload limit: 100MB/file</li>
              <li>📅 Unlimited encryptions per day</li>
              <li>🧠 AI-powered encryption optimization</li>
              <li>📤 Bulk image uploads</li>
              <li>☁️ 30-day cloud backup</li>
              <li>📊 Access logs & history</li>
              <li>🚀 Priority support (24/7)</li>
            </ul>
            <button 
              className="mt-6 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700" 
              onClick={()=> handlePaidClick('login', 'Premium')}
            >
              Subscribe
            </button>
          </div>

        </div>


      </section>

      {/* Plans Comparison */}
      <div>
        <div className="overflow-x-auto py-12 px-4">
          <h2 className="text-2xl  sm:text-4xl  text-center mb-10 font-bold">Compare Our Plans</h2>

          <table className="min-w-full text-sm  shadow-md rounded-xl overflow-hidden">
            <thead className=" text-secondary bg-card text-left">
              <tr>
                <th className="p-4 font-medium">Features</th>
                <th className="p-4 font-medium text-center">Free</th>
                <th className="p-4 font-medium text-center">Pro</th>
                <th className="p-4 font-medium text-center">Premium</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, idx) => (
                <tr key={idx} className="border-t border-gray-700 even:bg-background/100  ">
                  <td className="p-4 font-medium">{feature.name}</td>
                  <td className="p-4 text-center">
                    {typeof feature.free === 'boolean'
                      ? feature.free ? <Tick /> : <Cross />
                      : <span>{feature.free}</span>}
                  </td>
                  <td className="p-4 text-center">
                    {typeof feature.pro === 'boolean'
                      ? feature.pro ? <Tick /> : <Cross />
                      : <span>{feature.pro}</span>}
                  </td>
                  <td className="p-4 text-center">
                    {typeof feature.premium === 'boolean'
                      ? feature.premium ? <Tick /> : <Cross />
                      : <span>{feature.premium}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Why Upgrade */}
      <section className=" py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold  mb-4">
            Why Upgrade to <span className="text-primary">Encodex Plus?</span>
          </h2>
          <p className=" text-md mb-10">
            Unlock powerful tools and premium features built for users who care about privacy, speed, and scalability.
          </p>

          {/* Flexbox Wrapper */}
          <div className="flex flex-wrap justify-center gap-6">
            
            {/* Feature 1 */}
            <div className="flex-1 min-w-[280px] max-w-sm text-card-foreground bg-card p-6 rounded-xl shadow hover:shadow-md transition">
              <div className=" text-3xl mb-3">🔐</div>
              <h3 className="text-xl font-semibold mb-2">Advanced AES + RSA Encryption</h3>
              <p className=" text-sm">
                Double-layer security with military-grade encryption for complete protection of your images.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex-1 min-w-[280px] max-w-sm text-card-foreground bg-card p-6 rounded-xl shadow hover:shadow-md transition">
              <div className=" text-3xl mb-3">☁️</div>
              <h3 className="text-xl font-semibold  mb-2">Cloud Backup</h3>
              <p className=" text-sm">
                Automatically backup encrypted files with 7–30 days retention depending on your plan.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex-1 min-w-[280px] max-w-sm text-card-foreground bg-card p-6 rounded-xl shadow hover:shadow-md transition">
              <div className=" text-3xl mb-3">📤</div>
              <h3 className="text-xl font-semibold mb-2">Encrypted File Sharing</h3>
              <p className=" text-sm">
                Share secure, one-click encrypted links with team members, clients, or friends.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex-1 min-w-[280px] max-w-sm text-card-foreground bg-card p-6 rounded-xl shadow hover:shadow-md transition">
              <div className=" text-3xl mb-3">📈</div>
              <h3 className="text-xl font-semiboldmb-2">Unlimited Daily Encryptions</h3>
              <p className=" text-sm">
                Remove the free tier limits and encrypt as many files as you need — no restrictions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold  mb-6">
            Frequently Asked Questions
          </h2>
          <p className=" mb-12">
            Everything you need to know before subscribing to Encodex Plus.
          </p>

          <div className="space-y-4 text-left">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className=" border rounded-xl p-5 shadow-sm transition"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center text-left font-medium text-lg"
                >
                  {faq.question}
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 " />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-500" />
                  )} 
                </button>
                {openIndex === index && (
                  <p className="mt-3 text-sm">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>  

      {/* CTA  */}
      <section className="bg-signup text-white py-12 px-4 md:px-8 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Protect Your Data?</h2>
        <p className="text-md mb-6">Upgrade to Encodex Plus and unlock complete privacy, speed, and control — instantly.</p>
        <button 
          onClick={() => {
            document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="inline-block bg-white text-primary font-semibold py-3 px-6 rounded-lg hover:bg-primary hover:text-white transition"
        >
          View Subscription Plans
        </button >
      </section>

    </>
  );
};
