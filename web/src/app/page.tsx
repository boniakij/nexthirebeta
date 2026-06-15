'use client';

import Link from 'next/link';
import { Button, Card, Badge, StarRating, Avatar } from '@/components/ui';
import { Navbar } from '@/components/layout/Navbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowRight, PlayCircle, CheckCircle2, TrendingUp, Users, Briefcase, Award } from 'lucide-react';

const StatCounter = ({ value, label, icon: Icon }: { value: number; label: string, icon: any }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    const increment = value / steps;
    let current = 0;
    
    const interval = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-4xl font-extrabold text-gray-900 mb-1">{count.toLocaleString()}+</p>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
    </div>
  );
};

export default function HomePage() {
  const [trainers, setTrainers] = useState<any[]>([
    { id: 1, name: 'Arjun Kumar', domains: ['System Design', 'Backend'], rating: 4.9, price_per_hour: 500 },
    { id: 2, name: 'Priya Sharma', domains: ['Frontend', 'React'], rating: 4.8, price_per_hour: 450 },
    { id: 3, name: 'Rahul Singh', domains: ['DevOps', 'Cloud'], rating: 4.7, price_per_hour: 600 },
    { id: 4, name: 'Fatima Ahmed', domains: ['Data Science', 'ML'], rating: 4.9, price_per_hour: 700 },
    { id: 5, name: 'Nadia Islam', domains: ['HR', 'Behavioral'], rating: 4.6, price_per_hour: 350 },
    { id: 6, name: 'Hassan Khan', domains: ['Mobile', 'React Native'], rating: 4.8, price_per_hour: 500 },
  ]);

  const [packages, setPackages] = useState<any[]>([
    { id: 1, title: 'Beginner Interview Prep', price: 2000, difficulty_level: 'beginner', duration: '30 mins', trainer_id: 1 },
    { id: 2, title: 'Intermediate Interview Prep', price: 3500, difficulty_level: 'intermediate', duration: '45 mins', trainer_id: 1 },
    { id: 3, title: 'Advanced Interview Prep', price: 5000, difficulty_level: 'advanced', duration: '60 mins', trainer_id: 2 },
  ]);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await axios.get('/api/trainers?per_page=6&sort=rating');
        if (res.data?.data?.length > 0) {
          setTrainers(res.data.data);
        }
      } catch (err) {
        console.log('Using mock trainers data');
      }
    };
    fetchTrainers();
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get('/api/interview-packages?per_page=6');
        if (res.data?.data?.length > 0) {
          setPackages(res.data.data);
        }
      } catch (err) {
        console.log('Using mock packages data');
      }
    };
    fetchPackages();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary-100 selection:text-primary-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-purple-50 pt-20 pb-24 sm:pt-32 sm:pb-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Platform is live! Join 5000+ users
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">Interview Skills</span> with Experts
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Book 1-on-1 mock interviews with industry experts, get real-time feedback, earn XP badges, and land offers at top tech companies worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/feed" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 gap-2 group">
                Find Your Trainer
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 gap-2 border-2">
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-16 z-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <StatCounter value={50000} label="Mock Interviews" icon={TrendingUp} />
            <StatCounter value={850} label="Expert Trainers" icon={Award} />
            <StatCounter value={500} label="Companies Hiring" icon={Briefcase} />
            <StatCounter value={15000} label="Job Placements" icon={Users} />
          </div>
        </div>
      </section>
      
      {/* Company Logos Marquee */}
      <section className="py-10 border-y border-gray-100 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Trusted by leading companies</p>
        </div>
        <div className="relative flex overflow-x-hidden">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-16 py-4">
            {['Google', 'Microsoft', 'Amazon', 'Netflix', 'Meta', 'Apple', 'Spotify', 'Uber', 'Airbnb'].map((company, idx) => (
              <span key={idx} className="text-2xl font-bold text-gray-400 mx-8">{company}</span>
            ))}
          </div>
          <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center gap-16 py-4">
            {['Google', 'Microsoft', 'Amazon', 'Netflix', 'Meta', 'Apple', 'Spotify', 'Uber', 'Airbnb'].map((company, idx) => (
              <span key={idx} className="text-2xl font-bold text-gray-400 mx-8">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary-600 tracking-wide uppercase mb-2">Process</h2>
            <h3 className="text-3xl sm:text-5xl font-bold text-gray-900">How It Works</h3>
          </div>
          
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gradient-to-r from-primary-100 via-primary-300 to-purple-100 -z-10"></div>
            
            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  step: '1',
                  title: 'Register & Complete Profile',
                  description: 'Create your free account, set up your profile, and highlight your skills.',
                },
                {
                  step: '2',
                  title: 'Book an Expert Trainer',
                  description: 'Find top-rated professionals and schedule mock interviews in your domain.',
                },
                {
                  step: '3',
                  title: 'Ace Interviews & Get Hired',
                  description: 'Gain XP, get actionable feedback, and land offers from top companies.',
                },
              ].map((item, idx) => (
                <div key={idx} className="relative text-center">
                  <div className="w-24 h-24 mx-auto bg-white border-4 border-primary-50 rounded-full flex items-center justify-center shadow-xl mb-6 relative z-10">
                    <span className="text-3xl font-black text-primary-600">{item.step}</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Trainers */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-sm font-bold text-primary-600 tracking-wide uppercase mb-2">Experts</h2>
              <h3 className="text-3xl sm:text-5xl font-bold text-gray-900">Featured Trainers</h3>
            </div>
            <Link href="/trainers">
              <Button variant="outline" className="hidden sm:flex gap-2">
                View All Trainers <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.map((trainer) => (
              <Card key={trainer.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-200 flex flex-col h-full group">
                <div className="p-6 flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar src={trainer.user?.profile_photo} name={trainer.name} size="lg" />
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">{trainer.name}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        <StarRating rating={trainer.rating || 5} size="sm" />
                        <span className="text-sm font-medium text-gray-600 ml-1">({trainer.rating || 5.0})</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {trainer.domains?.map((domain: string, i: number) => (
                      <Badge key={i} variant="primary" className="text-xs">
                        {domain}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <div className="font-bold text-gray-900 text-lg">
                    ₹{trainer.price_per_hour}<span className="text-sm text-gray-500 font-normal">/session</span>
                  </div>
                  <Link href={`/trainers/${trainer.id}`}>
                    <Button size="sm">View Profile</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/trainers">
              <Button variant="outline" className="w-full gap-2">
                View All Trainers <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Become a Trainer CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-900 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-3xl font-bold mb-3">Are you an industry expert?</h3>
            <p className="text-lg text-primary-100 max-w-xl">Join our elite network of trainers. Set your own rates, help candidates succeed, and earn on your schedule.</p>
          </div>
          <Link href="/become-trainer" className="shrink-0">
            <Button size="lg" className="bg-white !text-primary-700 hover:bg-gray-100 h-14 px-8 text-lg font-bold shadow-xl border-none">
              Become a Trainer
            </Button>
          </Link>
        </div>
      </section>

      {/* Interview Packages Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-sm font-bold text-primary-600 tracking-wide uppercase mb-2">Courses</h2>
              <h3 className="text-3xl sm:text-5xl font-bold text-gray-900">Interview Packages</h3>
            </div>
            <Link href="/packages">
              <Button variant="outline" className="hidden sm:flex gap-2">
                View All Packages <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-200 flex flex-col h-full group">
                <div className="p-6 flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="primary" className="text-xs capitalize">
                      {pkg.difficulty_level}
                    </Badge>
                    <span className="text-xs text-gray-500">⏱️ {pkg.duration}</span>
                  </div>
                  <h4 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {pkg.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    {pkg.description || 'Professional interview preparation with personalized feedback'}
                  </p>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <div className="font-bold text-gray-900 text-lg">
                    ৳{pkg.price?.toLocaleString()}
                  </div>
                  <Link href={`/packages/${pkg.id}`}>
                    <Button size="sm">View Package</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/packages">
              <Button variant="outline" className="w-full gap-2">
                View All Packages <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview & Testimonials Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Leaderboard */}
            <div className="lg:col-span-5">
              <div className="mb-8">
                <h2 className="text-sm font-bold text-primary-600 tracking-wide uppercase mb-2">Rankings</h2>
                <h3 className="text-3xl font-bold text-gray-900">Top Students</h3>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-0">
                  {[
                    { rank: 1, name: 'Arjun Kumar', xp: 25000, level: 10 },
                    { rank: 2, name: 'Fatima Ahmed', xp: 24500, level: 10 },
                    { rank: 3, name: 'Rahul Singh', xp: 23800, level: 9 },
                    { rank: 4, name: 'Ayesha Khan', xp: 22100, level: 9 },
                    { rank: 5, name: 'Priya Sharma', xp: 20500, level: 8 },
                  ].map((entry, idx) => (
                    <div key={entry.rank} className={`flex items-center gap-4 p-4 ${idx !== 4 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' : entry.rank === 2 ? 'bg-gray-200 text-gray-700' : entry.rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
                        {entry.rank}
                      </div>
                      <Avatar name={entry.name} size="sm" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{entry.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-primary-600">{entry.xp.toLocaleString()} XP</span>
                        </div>
                      </div>
                      <Badge variant="primary" className="text-xs">
                        Lvl {entry.level}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <Link href="/leaderboard" className="block text-center text-sm font-semibold text-primary-600 hover:text-primary-700">
                    View Full Leaderboard →
                  </Link>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="lg:col-span-7">
              <div className="mb-8">
                <h2 className="text-sm font-bold text-primary-600 tracking-wide uppercase mb-2">Success Stories</h2>
                <h3 className="text-3xl font-bold text-gray-900">What Students Say</h3>
              </div>
              <div className="grid gap-6">
                {[
                  { quote: 'NextHire completely transformed my interview preparation. I landed a job at Google within 2 months!', author: 'Sarah Jenkins', role: 'Software Engineer at Google', rating: 5 },
                  { quote: 'The trainers are incredibly knowledgeable and provided actionable feedback that helped me ace my system design rounds.', author: 'Michael Chen', role: 'Backend Developer at Amazon', rating: 5 },
                  { quote: 'The gamification system kept me motivated to practice daily. Highly recommend to anyone job hunting!', author: 'Priya Sharma', role: 'Frontend Engineer at Meta', rating: 5 },
                ].map((testimonial, idx) => (
                  <Card key={idx} className="p-6 border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarRating key={i} rating={1} size="sm" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic text-lg leading-relaxed">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-4">
                      <Avatar name={testimonial.author} size="sm" />
                      <div>
                        <p className="font-bold text-gray-900">{testimonial.author}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                  NH
                </div>
                <span className="font-bold text-xl text-gray-900">NextHire</span>
              </Link>
              <p className="text-gray-600 mb-6 max-w-sm">
                The ultimate platform to practice interviews with industry experts, earn XP, and land your dream job at top tech companies.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                  <span className="font-bold">X</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                  <span className="font-bold">in</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                  <span className="font-bold">Gh</span>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-5">Platform</h4>
              <ul className="space-y-3">
                <li><Link href="/trainers" className="text-gray-600 hover:text-primary-600">Find Trainers</Link></li>
                <li><Link href="/leaderboard" className="text-gray-600 hover:text-primary-600">Leaderboard</Link></li>
                <li><Link href="/pricing" className="text-gray-600 hover:text-primary-600">Pricing</Link></li>
                <li><Link href="/companies" className="text-gray-600 hover:text-primary-600">For Companies</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-5">Resources</h4>
              <ul className="space-y-3">
                <li><Link href="/blog" className="text-gray-600 hover:text-primary-600">Blog</Link></li>
                <li><Link href="/guides" className="text-gray-600 hover:text-primary-600">Interview Guides</Link></li>
                <li><Link href="/faq" className="text-gray-600 hover:text-primary-600">FAQ</Link></li>
                <li><Link href="/support" className="text-gray-600 hover:text-primary-600">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-5">Stay Updated</h4>
              <p className="text-gray-600 text-sm mb-4">Subscribe to our newsletter for interview tips and platform updates.</p>
              <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <Button type="submit" className="w-full">Subscribe</Button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} NextHire Inc. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-primary-600">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary-600">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-primary-600">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
