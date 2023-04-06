import React, { useContext } from "react";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import "./NewPlace.css";
import {
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import useForm from "../../shared/hooks/form-hook";
import useHttpClient from "../../shared/hooks/http-hook";
import AuthContext from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHistory } from "react-router-dom";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const NewPlace = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [formState, inputChangeHandler] = useForm(
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
            image:{
                value:null,
                isValid:false
            }
        },
        false
    );

    const history = useHistory();
    const placeSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const formData=new FormData();
            formData.append('title', formState.inputs.title.value)
            formData.append('description', formState.inputs.description.value)
            formData.append('address', formState.inputs.address.value)
            formData.append('creator', auth.userId)
            formData.append('image', formState.inputs.image.value)
            await sendRequest(
                "http://localhost:5000/api/places",
                "POST",
                formData,
                {
                    Authorization:"Bearer "+auth.token
                }
            );

            history.push('/');
        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <form className="place-form" onSubmit={placeSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
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
                <ImageUpload id="image" onInput={inputChangeHandler} errorText="Please Provide an Image"/>
                <Button type="submit" disabled={!formState.isValid}>
                    ADD PLACE
                </Button>
            </form>
        </>
    );
};

export default NewPlace;
