interface FormFieldProps {
  label: string
  required?: boolean
  children: React.ReactNode
  description?: string
}

export function FormField({ label, required = false, children, description }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  )
}

interface TextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  type?: 'text' | 'email' | 'url' | 'number'
  min?: number
}

export function TextInput({ 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  type = 'text',
  min 
}: TextInputProps) {
  return (
    <input
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={min}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      placeholder={placeholder}
    />
  )
}

interface TextAreaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  rows?: number
}

export function TextArea({ 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  rows = 3 
}: TextAreaProps) {
  return (
    <textarea
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      placeholder={placeholder}
    />
  )
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
}

export function Select({ value, onChange, options, placeholder }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  id: string
}

export function Checkbox({ checked, onChange, label, id }: CheckboxProps) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mr-2"
      />
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
    </div>
  )
}