import React, { useState } from 'react'
import {
  Receipt,
  Wallet,
  Gift,
  ArrowRight,
  Lock,
  Smartphone,
  BarChart,
  Zap,
  PiggyBank,
  Share2,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom'
import Charts from './Charts'

const Button: React.FC<{
  children: React.ReactNode
  primary?: boolean
  onClick: () => void
}> = ({ children, primary = true, onClick }) => (
  <motion.button
    className={`rounded-full px-6 py-3 font-bold transition duration-300 ease-in-out ${
      primary
        ? 'bg-[#EEB85D] text-gray-900 hover:bg-[#D9A54D]'
        : 'bg-gray-700 text-[#EEB85D] hover:bg-gray-600'
    }`}
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.button>
)

const Section: React.FC<{
  children: React.ReactNode
  id?: string
  className?: string
}> = ({ children, id, className = '' }) => (
  <section id={id} className={`py-20 ${className}`}>
    <div className="container mx-auto px-4">{children}</div>
  </section>
)

// Feature Icon Component
const FeatureIcon: React.FC<{
  Icon: React.ComponentType<{ className?: string }>
  text: string
}> = ({ Icon, text }) => (
  <div className="flex cursor-pointer flex-col items-center">
    <div className="mb-2 flex size-16 items-center justify-center rounded-full bg-[#EEB85D]">
      <Icon className="size-8 text-gray-900" />
    </div>
    <span className="text-center text-sm text-gray-300">{text}</span>
  </div>
)

// Header Component
const Header: React.FC = () => {
  return (
    <header className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 text-center">
        <motion.h1
          className="mb-6 text-5xl font-bold text-[#EEB85D] md:text-6xl"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Pontos.Gratis
        </motion.h1>
        <motion.p
          className="mb-8 text-xl text-gray-300 md:text-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Revolutionizing Loyalty with Blockchain
        </motion.p>
        <div className="mb-12 flex justify-center space-x-8">
          <FeatureIcon Icon={Receipt} text="NFC-e Receipt Scanning" />
          <FeatureIcon Icon={Wallet} text="PONTOS Rewards System" />
          <FeatureIcon Icon={Gift} text="Custom Business Tokens" />
          <FeatureIcon Icon={PiggyBank} text="Pontos.Vault Investment" />
        </div>
        <div className="mb-12 flex flex-col items-center justify-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
          <Button onClick={() => console.log('Get Started')}>
            Get Started
          </Button>
          <motion.button
            className="flex items-center text-[#EEB85D] transition duration-300 hover:text-[#D9A54D]"
            whileHover={{ scale: 1.05 }}
            onClick={() => alert('Demo video played')}
          >
            Watch Demo <ArrowRight className="ml-2 size-4" />
          </motion.button>
          <Link to="/vault_analytics">
            <motion.button
              className="flex items-center rounded-full bg-gray-700 px-6 py-3 font-bold text-[#EEB85D] transition duration-300 hover:bg-gray-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Vault Analytics <BarChart className="ml-2 size-4" />
            </motion.button>
          </Link>
        </div>
      </div>
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        onClick={() => {
          window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
        }}
      >
        <ChevronDown className="size-12 animate-bounce text-[#EEB85D]" />
      </motion.div>
    </header>
  )
}

// Key Features Section
const FeatureCard: React.FC<{
  Icon: React.ElementType
  title: string
  description: string
}> = ({ Icon, title, description }) => (
  <motion.div
    className="rounded-lg bg-gray-800 p-8 shadow-lg"
    whileHover={{ scale: 1.03 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <Icon className="mb-4 size-16 text-[#EEB85D]" />
    <h3 className="mb-4 text-2xl font-bold text-[#EEB85D]">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
)

const KeyFeaturesSection: React.FC = () => {
  return (
    <Section id="features" className="bg-gray-900">
      <h2 className="mb-12 text-center text-4xl font-bold text-[#EEB85D]">
        Key Features
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          Icon={Receipt}
          title="Effortless Scanning"
          description="Scan NFC-e receipts instantly with your smartphone for immediate rewards."
        />
        <FeatureCard
          Icon={Wallet}
          title="PONTOS Rewards"
          description="Earn PONTOS tokens for every purchase, redeemable across our network."
        />
        <FeatureCard
          Icon={Gift}
          title="Custom Business Tokens"
          description="Businesses can create unique loyalty tokens for their customers."
        />
        <FeatureCard
          Icon={Lock}
          title="Secure Investments"
          description="Invest your PONTOS securely in Pontos.Vault for long-term growth."
        />
        <FeatureCard
          Icon={Share2}
          title="Referral Program"
          description="Earn more by referring friends and businesses to the platform."
        />
        <FeatureCard
          Icon={BarChart}
          title="Business Insights"
          description="Access powerful analytics to understand customer behavior and loyalty trends."
        />
      </div>
    </Section>
  )
}

// How It Works Section
const HowItWorksSection: React.FC = () => {
  return (
    <Section id="how-it-works" className="bg-gray-800">
      <h2 className="mb-12 text-center text-4xl font-bold text-[#EEB85D]">
        How It Works
      </h2>
      <div className="flex flex-col items-center">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Smartphone className="mx-auto mb-4 size-24 text-[#EEB85D]" />
          <h3 className="mb-2 text-2xl font-bold text-[#EEB85D]">
            1. Scan Receipts
          </h3>
          <p className="text-gray-300">
            Use our app to scan NFC-e receipts after your purchases.
          </p>
        </motion.div>
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Zap className="mx-auto mb-4 size-24 text-[#EEB85D]" />
          <h3 className="mb-2 text-2xl font-bold text-[#EEB85D]">
            2. Earn PONTOS
          </h3>
          <p className="text-gray-300">
            Instantly receive PONTOS rewards for your purchases.
          </p>
        </motion.div>
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <PiggyBank className="mx-auto mb-4 size-24 text-[#EEB85D]" />
          <h3 className="mb-2 text-2xl font-bold text-[#EEB85D]">
            3. Invest or Redeem
          </h3>
          <p className="text-gray-300">
            Choose to invest your PONTOS in Pontos.Vault or redeem for rewards.
          </p>
        </motion.div>
      </div>
    </Section>
  )
}

// Testimonials Section
const Testimonial: React.FC<{ text: string; author: string; role: string }> = ({
  text,
  author,
  role
}) => (
  <motion.div
    className="rounded-lg bg-gray-800 p-6 shadow-lg"
    whileHover={{ scale: 1.05 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <p className="mb-4 text-gray-300">&quot;{text}&quot;</p>
    <p className="font-bold text-[#EEB85D]">{author}</p>
    <p className="text-sm text-gray-400">{role}</p>
  </motion.div>
)

const TestimonialsSection: React.FC = () => {
  return (
    <Section id="testimonials" className="bg-gray-900">
      <h2 className="mb-12 text-center text-4xl font-bold text-[#EEB85D]">
        What Our Users Say
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Testimonial
          text="Pontos.Gratis has revolutionized how I earn and use loyalty rewards. It's so easy!"
          author="Maria Silva"
          role="Frequent Shopper"
        />
        <Testimonial
          text="As a business owner, Pontos.Gratis has helped me create a loyal customer base. The analytics are invaluable."
          author="João Santos"
          role="Store Owner"
        />
        <Testimonial
          text="The Pontos.Vault feature is a game-changer. My rewards are actually growing over time!"
          author="Ana Oliveira"
          role="Investment Enthusiast"
        />
      </div>
    </Section>
  )
}

// FAQ Section
const FAQSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'What is Pontos.Gratis?',
      answer:
        'Pontos.Gratis is a blockchain-based loyalty platform that allows users to earn rewards (PONTOS) for their purchases and businesses to create custom loyalty tokens.'
    },
    {
      question: 'How do I earn PONTOS?',
      answer:
        "You can earn PONTOS by scanning NFC-e receipts from participating businesses using our mobile app. You'll receive rewards instantly after each eligible purchase."
    },
    {
      question: 'What can I do with my PONTOS?',
      answer:
        'You can redeem PONTOS for rewards, invest them in Pontos.Vault for potential growth, or trade them with other users on our platform.'
    },
    {
      question: 'Is Pontos.Gratis secure?',
      answer:
        'Yes, Pontos.Gratis uses blockchain technology to ensure all transactions and data are secure and transparent.'
    }
  ]

  return (
    <Section id="faq" className="bg-gray-800">
      <h2 className="mb-12 text-center text-4xl font-bold text-[#EEB85D]">
        Frequently Asked Questions
      </h2>
      <div className="mx-auto max-w-3xl">
        {faqs.map((faq, index) => (
          <div key={index} className="mb-4">
            <button
              className="flex w-full items-center justify-between rounded-lg bg-gray-700 p-4 text-left focus:outline-none"
              onClick={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
            >
              <span className="font-bold text-[#EEB85D]">{faq.question}</span>
              <ChevronDown
                className={`size-5 text-[#EEB85D] transition-transform${
                  activeIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800 p-4 text-gray-300"
                >
                  <p>{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </Section>
  )
}

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 py-12 text-gray-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-2xl font-bold text-[#EEB85D]">
              Pontos.Gratis
            </h3>
            <p className="mb-4">
              Revolutionizing loyalty with blockchain technology.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="transition duration-300 hover:text-[#EEB85D]"
              >
                <Facebook />
              </a>
              <a
                href="#"
                className="transition duration-300 hover:text-[#EEB85D]"
              >
                <Twitter />
              </a>
              <a
                href="#"
                className="transition duration-300 hover:text-[#EEB85D]"
              >
                <Instagram />
              </a>
              <a
                href="#"
                className="transition duration-300 hover:text-[#EEB85D]"
              >
                <Linkedin />
              </a>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-xl font-bold text-[#EEB85D]">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="transition duration-300 hover:text-[#EEB85D]"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="transition duration-300 hover:text-[#EEB85D]"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="transition duration-300 hover:text-[#EEB85D]"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="transition duration-300 hover:text-[#EEB85D]"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xl font-bold text-[#EEB85D]">
              Contact Us
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="mr-2 size-5 text-[#EEB85D]" />
                <a
                  href="mailto:info@pontos.gratis"
                  className="transition duration-300 hover:text-[#EEB85D]"
                >
                  info@pontos.gratis
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 size-5 text-[#EEB85D]" />
                <a
                  href="tel:+551234567890"
                  className="transition duration-300 hover:text-[#EEB85D]"
                >
                  +55 (12) 3456-7890
                </a>
              </li>
              <li className="flex items-center">
                <MapPin className="mr-2 size-5 text-[#EEB85D]" />
                <span>São Paulo, Brazil</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xl font-bold text-[#EEB85D]">
              Newsletter
            </h4>
            <p className="mb-4">
              Stay updated with our latest news and offers.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="grow rounded-l-md border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EEB85D]"
              />
              <button
                type="submit"
                className="rounded-r-md bg-[#EEB85D] px-4 py-2 font-semibold text-gray-900 transition duration-300 hover:bg-[#D9A54D]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} Pontos.Gratis. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gray-900 font-sans text-gray-300">
      <Header />
      <KeyFeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/vault_analytics',
    element: <Charts />
  }
])

export default function App() {
  return <RouterProvider router={router} />
}
