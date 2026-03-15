type AuthInputProps = {
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  required?: boolean;
};

export default function AuthInput({
  label,
  type = "text",
  value,
  placeholder,
  onChange,
  required = false,
}: AuthInputProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-800 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-200"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}