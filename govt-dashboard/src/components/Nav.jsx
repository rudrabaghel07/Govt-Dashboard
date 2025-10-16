
const Nav = () => {
  return (
    <nav className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-sky-600 rounded-full" />
          <div className="font-semibold text-slate-800">Govt Dashboard</div>
        </div>
        <div className="text-sm text-slate-600">Public Data View</div>
      </div>
    </nav>
  );
};

export default Nav;
