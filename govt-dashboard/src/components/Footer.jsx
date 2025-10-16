
const Footer = () => {
  return (
    <footer className="mt-8 py-6 border-t bg-white">
      <div className="max-w-6xl mx-auto px-4 text-sm text-slate-600 flex justify-between">
        <div>© {new Date().getFullYear()} Govt Dashboard</div>
        <div>
          <a className="text-sky-600" href="#">Privacy</a>
          <span className="mx-2">•</span>
          <a className="text-sky-600" href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
