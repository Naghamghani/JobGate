export default function Button({ title, onClick }) {
  return (
    <button
      className="w-full px-4 py-1.5 rounded-full font-semibold text-sm border border-[#004182] text-[#004182] hover:bg-[#ebf4fd] hover:border-2 transition-all"
      onClick={onClick}
    >
      {title}
    </button>
  );
}
