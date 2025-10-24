import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, FileText, Users, CheckCircle, Lock, Clock } from 'lucide-react';
import AppContext from '../../context/AppContext';

const Home = () => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/cases');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-emerald-50 to-white py-6 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                  Cyber Crime Reporting Platform
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Report Cyber Attacks with
                <span className="text-emerald-500"> Confidence</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                CasePerl provides a secure platform for victims of cyber attacks to file cases, 
                get expert assistance from agents, and receive solutions from our dedicated admin team.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetStarted}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Get Started
                </button>
                {/* <Link
                  to="/about"
                  className="border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 text-center"
                >
                  Learn More
                </Link> */}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-200 rounded-3xl transform rotate-6"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl">
                    <div className="bg-emerald-500 p-3 rounded-lg">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Secure Reporting</p>
                      <p className="text-sm text-gray-600">Your data is protected</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                    <div className="bg-blue-500 p-3 rounded-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Expert Agents</p>
                      <p className="text-sm text-gray-600">Professional assistance</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                    <div className="bg-purple-500 p-3 rounded-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Easy Case Filing</p>
                      <p className="text-sm text-gray-600">Simple process</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Why Choose CasePerl?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive platform designed to support cyber attack victims through every step of the reporting process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 space-y-4">
              <div className="bg-emerald-100 w-16 h-16 rounded-xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Secure Platform</h3>
              <p className="text-gray-600 leading-relaxed">
                Your sensitive information is protected with enterprise-grade security measures and encryption protocols.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 space-y-4">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Expert Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with trained agents who understand cyber crime and can guide you through the reporting process.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 space-y-4">
              <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Easy Filing</h3>
              <p className="text-gray-600 leading-relaxed">
                File your cyber attack case with our streamlined, user-friendly interface in just a few simple steps.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 space-y-4">
              <div className="bg-amber-100 w-16 h-16 rounded-xl flex items-center justify-center">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Quick Response</h3>
              <p className="text-gray-600 leading-relaxed">
                Our admin team investigates cases promptly and provides timely solutions to resolve your issues.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 space-y-4">
              <div className="bg-red-100 w-16 h-16 rounded-xl flex items-center justify-center">
                <Lock className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Confidential</h3>
              <p className="text-gray-600 leading-relaxed">
                All case details are handled with strict confidentiality to protect your privacy and security.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 space-y-4">
              <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Track Progress</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor your case status in real-time and stay informed about investigation progress and updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get help in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="relative text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-emerald-500 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">
                  1
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Report the Incident</h3>
              <p className="text-gray-600 leading-relaxed">
                Create an account and file your cyber attack case with detailed information about the incident you've experienced.
              </p>
            </div>

            <div className="relative text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-emerald-500 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">
                  2
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Get Agent Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Our trained agents will review your case and provide guidance, support, and assistance throughout the process.
              </p>
            </div>

            <div className="relative text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-emerald-500 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Receive Solutions</h3>
              <p className="text-gray-600 leading-relaxed">
                Our admin team investigates your case thoroughly and delivers effective solutions to resolve your cyber attack issues.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={handleGetStarted}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Your Case Report
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-emerald-500 to-emerald-600">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to Report Your Case?
          </h2>
          <p className="text-xl text-emerald-50 max-w-3xl mx-auto leading-relaxed">
            Join thousands of users who trust CasePerl for secure, confidential, and effective cyber crime reporting. 
            Our team is ready to help you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-white text-emerald-600 hover:bg-gray-50 px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started Now
            </button>
            {/* <Link
              to="/contact"
              className="border-2 border-white text-white hover:bg-emerald-400 px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-200"
            >
              Contact Support
            </Link> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;