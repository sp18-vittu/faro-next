import React, { useEffect, useState } from "react";
import { Input } from "antd";
import usePlacesAutocomplete, { getDetails } from "use-places-autocomplete";
import { FormInstance } from "antd/lib/form";

import styles from "./styles.module.scss";

interface GooglePlacesAutoCompleteProps {
  form: FormInstance;
  defaultValue?: string;
  updateValue: (details: any)=> void;
  onClear: ()=> void;
}
const GooglePlacesAutoComplete = ({
  form,
  defaultValue,
  updateValue,
  onClear,
  ...props
}: GooglePlacesAutoCompleteProps) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();
  const [selectedAddressData, setSelectedAddressData] = useState({
    formatted_address: "",
    address_components: "",
  });
  const [defaultLocation, setDefaultLocation] = useState<string | null>(null);

  const handleSelect =
    ({ description, place_id }: any) =>
    () => {

      setValue(description, false);
      clearSuggestions();
      const parameter = {
        placeId: place_id,
      };
      getDetails(parameter)
        .then((details: any) => {
          // For Japan place API returns just zip code not exact text as in suggestions so we override formatted text 
          const country: any = details?.address_components?.find((component: any) => component.types[0] === "country");

          if (country?.long_name === "Japan") {
            details.formatted_address = description;
          }
          updateValue(details);
        })
        .catch((error) => {
          console.log("Error: ", error);
        });
    };

  const handleInput = (e: any) => {
    if (e.target.value.length < 1) {
      setDefaultLocation(null);
      onClear();

    }
    setValue(e.target.value);
  };

  const renderSuggestions: () => React.ReactNode = () =>
    data.map((suggestion: any) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;
      return (
        <li key={place_id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  useEffect(() => {
    if (defaultValue) {
      setDefaultLocation(defaultValue);
    }
  }, [defaultValue]);

  return (
    <>
      <Input
        value={!!value ? value : defaultLocation || ""}
        onChange={handleInput}
        disabled={!ready}
        autoComplete="off"
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === "OK" && (
        <ul className={styles["places-suggestions"]}>{renderSuggestions()}</ul>
      )}
    </>
  );
};
export default GooglePlacesAutoComplete;
