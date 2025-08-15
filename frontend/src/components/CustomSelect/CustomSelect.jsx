import { Fragment, useMemo, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import Svg from "../Svg/svg";
import css from "./CustomSelect.module.css";

export const CustomSelect = ({ label, options, selected, onChange }) => {
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    if (!query) {
      return [...options].sort((a, b) => a.name.localeCompare(b.name));
    }

    return options
      .filter((option) =>
        option.name.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [query, options]);

  return (
    <div className={css.divCustomSelect}>
      <Listbox
        value={selected}
        onChange={(val) => {
          onChange(val);
          setQuery("");
        }}
      >
        <div className={css.divButton}>
          <Listbox.Button className={css.listboxButton}>
            <span className={css.btnSpan1}>{selected || label}</span>
            <span className={css.btnSpan2}>
              <Svg styles={css.svg} name={"dropDownArrow"}></Svg>
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className={css.listboxOptions}>
              <div className={css.searchWrapper}>
                <input
                  type="text"
                  placeholder="Search..."
                  className={css.searchInput}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              {filteredOptions.length === 0 ? (
                <div className={css.option}>Nothing found</div>
              ) : (
                filteredOptions.map((option) => (
                  <Listbox.Option
                    key={option._id}
                    value={option}
                    className={css.option}
                  >
                    {option.name}
                  </Listbox.Option>
                ))
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
