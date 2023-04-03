import React from "react";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import "./NewPlace.css";
import {
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import useForm from "../../shared/hooks/form-hook";

const NewPlace = () => {
   const [formState,inputChangeHandler]= useForm(
        {
            title: {
                value: "",
                isValid: false,
            },
            description: {
                value: "",
                isValid: false,
            },
            address: {
                value: "",
                isValid: false,
            },
        },
        false
    );

    const placeSubmitHandler = (e) => {
        e.preventDefault();
        console.log(formState.inputs);
    };

    return (
        <form className="place-form" onSubmit={placeSubmitHandler}>
            <Input
                id="title"
                element="input"
                type="text"
                label="Title"
                errorText="Enter a Valid Title"
                validators={[VALIDATOR_REQUIRE()]}
                onInput={inputChangeHandler}
            />
            <Input
                id="description"
                element="textarea"
                label="Description"
                errorText="Enter a Valid Description (at least 5 characters)"
                validators={[VALIDATOR_MINLENGTH(5)]}
                onInput={inputChangeHandler}
            />
            <Input
                id="address"
                element="input"
                label="Address"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid address."
                onInput={inputChangeHandler}
            />
            <Button type="submit" disabled={!formState.isValid}>
                ADD PLACE
            </Button>
        </form>
    );
};

export default NewPlace;
