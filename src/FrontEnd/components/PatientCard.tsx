import { CheckIcon, EditIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { Box, Card, CardBody, CardHeader, CircularProgress, FormControl, FormErrorIcon, FormErrorMessage, FormHelperText, FormLabel, Grid, GridItem, Heading, HStack, IconButton, Input, Select, Spacer } from '@chakra-ui/react';
import * as React from 'react';
import { PatientDTO } from '../types/patients';

type PatientCardProps = {
    patient: PatientDTO;
    onSaveClicked(): Promise<any>;
    onCancelEditClicked(): any;
    onChange(patient: PatientDTO): any;
}

export const PatientCard = (props: PatientCardProps) => {

    const [isEditing, setIsEditing] = React.useState<boolean>();
    const [isSaving, setIsSaving] = React.useState<boolean>();


    const onFirstNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(Object.assign({}, props.patient, {firstName: e.target.value}));
    }

    const onLastNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(Object.assign({}, props.patient, {lastName: e.target.value}))
    }

    const onGenderChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
        props.onChange(Object.assign({}, props.patient, {gender: e.target.value}));
    }

    const onBirthdayChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(Object.assign({}, props.patient, {birthday: e.target.value}));

    }

    const onCancelEditClickedLocal = () => {
        props.onCancelEditClicked();
        setIsEditing(false);
    }

    const onSaveClickedLocal = async () => {
        setIsSaving(true);
        await props.onSaveClicked();
        setIsEditing(false);
        setIsSaving(false);
    }

    const lastNameIsInvalid = !props.patient.lastName;
    const firstNameIsInvalid = !props.patient.firstName;
    const birthdayIsInvalid = !props.patient.birthday;
    const genderIsInvalid = !props.patient.gender;

    return (
        <Card size="sm" w={"full"} key={props.patient.id}>
            {!isEditing && (
                <>
                    <CardHeader>
                        <HStack>
                            <Heading size="sm">
                                {props.patient.lastName}, {props.patient.firstName}
                            </Heading>
                            <Spacer />
                            <Box>
                                {isSaving && (
                                    <CircularProgress isIndeterminate />
                                )}
                                {!isSaving && (
                                    <IconButton
                                        aria-label='Edit'
                                        icon={<EditIcon />}
                                        onClick={() => { setIsEditing(true) }}
                                    />
                                )}
                            </Box>
                        </HStack>
                    </CardHeader>
                    <CardBody>
                        <HStack>
                            <FormControl>
                                <FormLabel>Gender</FormLabel>
                                {props.patient.gender}
                            </FormControl>
                            <FormControl>
                                <FormLabel>Birthday</FormLabel>
                                {props.patient.birthday}
                            </FormControl>
                        </HStack>
                    </CardBody>
                </>
            )}
            {isEditing && (
                <>
                    <CardHeader>
                        <HStack>
                            <Spacer />
                            <Box>
                                {isSaving && (
                                    <CircularProgress isIndeterminate />
                                )}
                                {!isSaving && (
                                    <>
                                        <IconButton
                                            aria-label='Cancel'
                                            icon={<SmallCloseIcon />}
                                            onClick={() => { onCancelEditClickedLocal() }}
                                        />
                                        <IconButton
                                            aria-label='Save'
                                            icon={<CheckIcon />}
                                            onClick={() => { onSaveClickedLocal() }}
                                        />
                                    </>
                                )}
                            </Box>
                        </HStack>
                    </CardHeader>
                    <CardBody>
                        <HStack pb={5}>
                            <FormControl isInvalid={lastNameIsInvalid}>
                                <FormLabel>Last Name</FormLabel>
                                <Input type="text"  value={props.patient.lastName} onChange={(e) => { onLastNameChanged(e) }} />
                                {!lastNameIsInvalid ? (
                                    <FormHelperText>
                                        The patient's last name.
                                    </FormHelperText>
                                ) : (
                                    <FormErrorMessage>Required</FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl isInvalid={firstNameIsInvalid}>
                                <FormLabel>First Name</FormLabel>
                                <Input type="text" value={props.patient.firstName} onChange={(e) => { onFirstNameChanged(e) }} />
                                {!firstNameIsInvalid ? (
                                    <FormHelperText>
                                        The patient's first name.
                                    </FormHelperText>
                                ) : (
                                    <FormErrorMessage>Required</FormErrorMessage>
                                )}
                            </FormControl>
                        </HStack>
                        <HStack>
                            <FormControl isInvalid={genderIsInvalid}>
                                <FormLabel>Gender</FormLabel>
                                <Select placeholder="Select" value={props.patient.gender} onChange={(e) => { onGenderChanged(e) }}>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </Select>
                                {!genderIsInvalid ? (
                                    <FormHelperText>
                                        The patient's gender.
                                    </FormHelperText>
                                ) : (
                                    <FormErrorMessage>Required</FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl isInvalid={birthdayIsInvalid}>
                                <FormLabel>Birthday</FormLabel>
                                <Input type="date" value={props.patient.birthday} onChange={(e) => { onBirthdayChanged(e) }} />
                                {!lastNameIsInvalid ? (
                                    <FormHelperText>
                                        The patient's birthday.
                                    </FormHelperText>
                                ) : (
                                    <FormErrorMessage>Required</FormErrorMessage>
                                )}
                            </FormControl>
                        </HStack>
                    </CardBody>
                </>
            )}
        </Card>
    )
}