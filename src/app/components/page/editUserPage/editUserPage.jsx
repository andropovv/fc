import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { validator } from "../../../utils/validator";
import TextField from "../../common/form/textField";
import SelectField from "../../common/form/selectField";
import RadioField from "../../common/form/radioField";
import MultiSelectField from "../../common/form/multiSelectField";
import BackHistoryButton from "../../common/backButton";
import { useProfessions } from "../../../hooks/useProfession";
import { useQualities } from "../../../hooks/useQualities";
import { useAuth } from "../../../hooks/useAuth";
import { useUser } from "../../../hooks/useUsers";

const EditUserPage = () => {
    const { currentUser } = useAuth();

    const history = useHistory();
    const [data, setData] = useState({
        email: "",
        profession: "",
        sex: "male",
        name: "",
        qualities: []
    });

    const { isLoading: isUserLoading } = useUser();

    const { updateUser } = useAuth();
    const {
        qualities,
        isLoading: IsQualitiesLoading,
        getQuality
    } = useQualities();
    const qualitiesList = transformData(qualities);
    const { professions, isLoading: isProfessionLoading } = useProfessions();
    const professionsList = transformData(professions);
    const [errors, setErrors] = useState({});

    function transformData(data) {
        return data.map((d) => ({
            label: d.name,
            value: d._id
        }));
    }
    function getQualitiesById(qualIds) {
        return qualIds.map((qId) => getQuality(qId));
    }

    useEffect(() => {
        if (!isProfessionLoading && !isUserLoading && !IsQualitiesLoading) {
            setData((prevState) => ({
                ...prevState,
                ...currentUser,
                qualities: transformData(
                    getQualitiesById(currentUser.qualities)
                ),
                profession: currentUser.profession
            }));
        }
    }, [isProfessionLoading, isUserLoading, IsQualitiesLoading]);

    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };
    const validatorConfig = {
        email: {
            isRequired: {
                message: "Электронная почта обязательна для заполнения"
            },
            isEmail: {
                message: "Email введен некорректно"
            }
        },
        name: {
            isRequired: {
                message: "Имя обязательно для заполнения"
            },
            min: {
                message: "Имя должно состоять минимум из 3 символов",
                value: 3
            }
        },

        profession: {
            isRequired: {
                message: "Обязательно выберите вашу профессию"
            }
        }
    };
    useEffect(() => {
        validate();
    }, [data]);
    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const isValid = Object.keys(errors).length === 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        const newData = {
            ...data,
            qualities: data.qualities.map((q) => q.value)
        };
        console.log(newData, "nd");
        try {
            await updateUser(newData);
            history.goBack();
        } catch (error) {
            setErrors(error);
        }
    };
    return (
        <div className="container mt-5">
            <BackHistoryButton />
            <div className="row">
                <div className="col-md-6 offset-md-3 shadow p-4">
                    {!isProfessionLoading &&
                    !isUserLoading &&
                    !IsQualitiesLoading &&
                    Object.keys(professions).length > 0 ? (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Имя"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                error={errors.name}
                            />
                            <TextField
                                label="Электронная почта"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                error={errors.email}
                            />
                            <SelectField
                                label="Выбери свою профессию"
                                defaultOption="Choose..."
                                options={professionsList}
                                name="profession"
                                onChange={handleChange}
                                value={data.profession}
                                error={errors.profession}
                            />
                            <RadioField
                                options={[
                                    { name: "Male", value: "male" },
                                    { name: "Female", value: "female" },
                                    { name: "Other", value: "other" }
                                ]}
                                value={data.sex}
                                name="sex"
                                onChange={handleChange}
                                label="Выберите ваш пол"
                            />
                            <MultiSelectField
                                defaultValue={data.qualities}
                                options={qualitiesList}
                                onChange={handleChange}
                                name="qualities"
                                label="Выберите ваши качества"
                            />
                            <button
                                type="submit"
                                disabled={!isValid}
                                className="btn btn-primary w-100 mx-auto"
                            >
                                Обновить
                            </button>
                        </form>
                    ) : (
                        "Loading..."
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditUserPage;
