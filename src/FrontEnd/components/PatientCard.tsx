import { CheckIcon, EditIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { Box, Card, CardBody, CardHeader, CircularProgress, FormControl, FormLabel, Grid, GridItem, Heading, HStack, IconButton, Input, Select, Spacer } from '@chakra-ui/react';
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
                        <HStack>
                            <FormControl>
                                <FormLabel>Last Name</FormLabel>
                                <Input type="text"  value={props.patient.lastName} onChange={(e) => { onLastNameChanged(e) }} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>First Name</FormLabel>
                                <Input type="text" value={props.patient.firstName} onChange={(e) => { onFirstNameChanged(e) }} />
                            </FormControl>
                        </HStack>
                        <HStack>
                            <FormControl>
                                <FormLabel>Gender</FormLabel>
                                <Select placeholder="Select" value={props.patient.gender} onChange={(e) => { onGenderChanged(e) }}>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Birthday</FormLabel>
                                <Input type="date" value={props.patient.birthday} onChange={(e) => { onBirthdayChanged(e) }} />
                            </FormControl>
                        </HStack>
                    </CardBody>
                </>
            )}
        </Card>
    )
}