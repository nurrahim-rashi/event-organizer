export default function Footer() {
  return (
    <footer className="bg-[#110b1b] px-6 py-4 border-t border-[#4d4354]/10">
      <div className="max-w-[1280px] mx-auto border-t border-[#4d4354]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#cfc2d6]">
        <p>© 2026 MyEvents Indonesia. All rights reserved.</p>
        <div className="flex gap-8">
          <a
            className="hover:text-[#ddb7ff] transition-colors"
            href="/privacy-policy"
          >
            Privacy Policy
          </a>
          <a
            className="hover:text-[#ddb7ff] transition-colors"
            href="/terms-of-service"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
