import { Facebook, Twitter, Instagram, Github, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                <span className="text-gray-900 font-bold text-lg">V</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight">Vision Shirt</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Empowering creators with AI-driven design tools. Create, visualize, and wear your imagination.
                        </p>
                        <div className="flex gap-4">
                            <SocialLink icon={Twitter} />
                            <SocialLink icon={Instagram} />
                            <SocialLink icon={Github} />
                            <SocialLink icon={Facebook} />
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200 mb-6">Product</h3>
                        <ul className="space-y-4">
                            <FooterLink>Features</FooterLink>
                            <FooterLink>Pricing</FooterLink>
                            <FooterLink>Gallery</FooterLink>
                            <FooterLink>Size Guide</FooterLink>
                            <FooterLink>API Access</FooterLink>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200 mb-6">Company</h3>
                        <ul className="space-y-4">
                            <FooterLink>About Us</FooterLink>
                            <FooterLink>Careers</FooterLink>
                            <FooterLink>Blog</FooterLink>
                            <FooterLink>Contact</FooterLink>
                            <FooterLink>Partners</FooterLink>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200 mb-6">Stay Updated</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Subscribe to our newsletter for the latest design trends and updates.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500"
                                disabled
                            />
                            <button className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Vision Shirt. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <FooterLink>Privacy Policy</FooterLink>
                        <FooterLink>Terms of Service</FooterLink>
                        <FooterLink>Cookie Policy</FooterLink>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ icon: Icon }: { icon: any }) {
    return (
        <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full">
            <Icon size={20} />
        </a>
    );
}

function FooterLink({ children }: { children: React.ReactNode }) {
    return (
        <li>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm block w-fit">
                {children}
            </a>
        </li>
    );
}
