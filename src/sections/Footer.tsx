export default function Footer() {
  return (
    <footer
      data-bg-theme="dark"
      className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-7"
      style={{ background: '#07070A' }}
    >
      <p className="text-[13px]" style={{ color: '#6B6B7B' }}>
        © 2025 Ehsan Ul Haq
      </p>
      <p className="text-[13px] mt-2 md:mt-0" style={{ color: '#6B6B7B' }}>
        Crafted with React & Three.js
      </p>
    </footer>
  );
}
