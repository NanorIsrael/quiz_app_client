interface CheckboxGroupProps {
  options: string[];
  selectedOption: string;
  onOptionChange: (option: string) => void;
}
const CheckboxGroup = ({
  options,
  selectedOption,
  onOptionChange,
}: CheckboxGroupProps) => {
  return (
    <div>
      {options.map((option) => (
        <div key={option} className={'check_box m-4'}>
          <label>
            <input
              type="checkbox"
              value={option}
              checked={selectedOption === option}
              onChange={() => onOptionChange(option)}
            />
            {option}
          </label>
        </div>
      ))}
    </div>
  );
};

export default CheckboxGroup;
