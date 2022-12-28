import { Box, Button, CircularProgress, Heading, Input, Stack, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { PageHead } from '../components/Head';
import { PageHeading } from '../components/PageHeading';

const UploadPage = () => {

    const [selectedFile, setSelectedFile] = React.useState<File>();
    const [isFilePicked, setIsFilePicked] = React.useState<boolean>();
    const [isLoading, setIsLoading] = React.useState<boolean>();

    const toast = useToast();
    const router = useRouter();

    const fileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event?.target?.files) {
            var file = event.target.files[0];
            setSelectedFile(file);
            setIsFilePicked(true);
        }
        else {
            setIsFilePicked(false);
        }
    }

    const uploadFile = async () => {
        if (selectedFile) {
            setIsLoading(true);
            const formData = new FormData();
            formData.append("file", selectedFile, 'file');

            var resp = await fetch("/api/patients/list", {
                method: 'post',
                body: formData
            });

            if (!resp.ok) {
                var text = await resp.text();
                toast({
                    title: 'Problem during upload',
                    description: text,
                    status: 'error'
                })
            }
            else {
                toast({
                    title: 'Upload successful',
                    status: "success"
                });

                router.push('/');
            }

            setIsLoading(false);
        }
    }

    return (
        <>
            <PageHead
                title='Upload CSV'
            />
            <Stack w="full">
                <PageHeading heading="Upload CSV"/>
                <Box>
                    {isLoading && (
                        <CircularProgress isIndeterminate />
                    )}
                    {!isLoading && (
                        <>
                            <Input type="file" name="file" onChange={fileChangeHandler} />
                            <Button onClick={uploadFile} disabled={!isFilePicked} >Upload</Button>
                        </>
                    )}
                </Box>
            </Stack>
        </>
    )
}

export default UploadPage;