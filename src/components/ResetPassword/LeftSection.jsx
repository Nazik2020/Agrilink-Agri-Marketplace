import Image from "../../assets/login/spices.jpg";

export default function LeftSection() {
  return (
    <div className="w-full md:w-1/2 bg-gradient-to-br from-black to-green-600 flex flex-col justify-center items-center text-center relative min-h-screen">
      <div className="relative w-full h-full">
        <img
          src={Image || "/placeholder.svg"}
          alt="Reset Password Illustration"
          className="w-full h-full object-cover opacity-50 md:object-cover"
        />
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center px-4 text-center text-white">
          <div className="relative group">
            <div className="absolute inset-[-15px] bg-white/10 p-5"></div>
            <p
              className="text-lg mt-5 sm:text-2xl md:text-2xl lg:text-5xl relative z-10 font-semibold"
              style={{ marginBottom: "30px" }}
            >
              "Create New Password"
            </p>
          </div>
          <p
            className="text-xs text-green-100 font-light-bold leading-tight mb-2"
            style={{ color: "#b7d5af", fontWeight: "500" }}
          >
            Your security is our priority. Create a strong password to protect
            your account and continue your agricultural journey with confidence.
            Trade safely and grow your business with peace of mind.
          </p>
        </div>
      </div>
    </div>
  );
}
