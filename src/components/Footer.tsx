import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { FaBuilding } from "react-icons/fa";


const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="bg-purple-600 p-2 rounded-lg">
                                <FaBuilding className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold">UniStay</span>
                        </div>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Your trusted platform for finding the perfect home near campus.
                        </p>
                        <div className="flex space-x-4">
                            <Facebook className="h-5 w-5 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors duration-200" />
                            <Twitter className="h-5 w-5 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors duration-200" />
                            <Instagram className="h-5 w-5 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors duration-200" />
                            <Linkedin className="h-5 w-5 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors duration-200" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            {["Home", "Services", "Landlords", "Contact"].map((link) => (
                                <li key={link}>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-purple-400 transition-colors duration-200"
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Services</h3>
                        <ul className="space-y-4">
                            {["Find Hostels", "Book a Room", "Instant Payments", "Student-Landlord Chat"].map(
                                (service) => (
                                    <li key={service}>
                                        <a
                                            href="#"
                                            className="text-gray-400 hover:text-purple-400 transition-colors duration-200"
                                        >
                                            {service}
                                        </a>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <Phone className="h-5 w-5 text-purple-400 flex-shrink-0" />
                                <span className="text-gray-400">+254 791374659</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-purple-400 flex-shrink-0" />
                                <span className="text-gray-400">info@unistay.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                    <p className="text-gray-400">
                        © 2026 Unistay. All rights reserved. | Privacy Policy | Terms of Service
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
