import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ChevronRight, Facebook, Twitter, Instagram, Linkedin, Send, Mail } from 'lucide-react';

const FooterSection: React.FC = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-slate-900 text-white py-16 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Newsletter Section */}
                <div className="mb-16 p-8 bg-slate-800/50 rounded-3xl border border-slate-700/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Subscribe to our newsletter</h3>
                            <p className="text-slate-400">Get the latest updates, tips, and special offers directly to your inbox.</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-white placeholder-slate-500 transition-colors"
                                />
                            </div>
                            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2">
                                Subscribe <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 p-1">
                                <img src="/mascot/logofl.png" alt="Mascot" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">ForeignLang</span>
                        </Link>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed text-justify">
                            Empower your communication with AI-driven tools. Write perfect emails, learn languages faster, and boost your professional confidence.
                        </p>
                        {/* Social Icons */}
                        <div className="flex gap-4">
                            {[
                                { icon: Facebook, href: "#", label: "Facebook" },
                                { icon: Twitter, href: "#", label: "Twitter" },
                                { icon: Instagram, href: "#", label: "Instagram" },
                                { icon: Linkedin, href: "#", label: "LinkedIn" }
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1"
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Product</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><a href="#features" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Features</a></li>
                            <li><Link to="/pricing" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Pricing</Link></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Templates</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Integrations</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Company</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link to="/about" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> About Us</Link></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Careers</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Blog</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Legal</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Terms of Service</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={14} /> Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>{t('landing.footer.copyright')} © {new Date().getFullYear()} ForeignLang. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1">Made by <span className="text-indigo-600 font-bold">FiveFusion</span> Team</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterSection;
