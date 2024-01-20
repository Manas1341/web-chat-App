import React, { useState } from 'react'
import { VStack } from '@chakra-ui/layout'
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/toast";
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const Signup = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [picLoading, setPicLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate()

    const handleClick = () => setShow(!show);

    const postDetails = (pics) => {
        setPicLoading(true);
        if (pics === undefined) {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
            const data = new FormData()
            data.append('file', pics)
            data.append('upload_preset','Vartalaap')
            data.append('cloud_name', 'duioe2bh8')
            axios.post("https://api.cloudinary.com/v1_1/duioe2bh8/image/upload", data)
            .then((response) => {
                console.log("Cloudinary response:", response);
                setPic(response.data.url.toString());
                setPicLoading(false);
                toast({
                  title: "Image uploaded successfully!",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                  position: "bottom",
                });
              })
              .catch((error) => {
                console.log("Cloudinary error:", error);
                setPicLoading(false);
              })
        }
        else {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false);
            return;
        }
    }

    const submitHandler = async () => { 
        setPicLoading(true);
        if (!name || !email || !password || !confirmpassword) {
            toast({
              title: "Please Fill all the Feilds",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setPicLoading(false);
            return;
          }
          if (password !== confirmpassword) {
            toast({
              title: "ConfirmPassword doenot match the Password",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setPicLoading(false);
            return;
          }  

          try {
            const config = {
              headers: {
                "Content-Type": "application/json",
              },
            };
            const { data } = await axios.post(
              "http://localhost:8080/user/register",
              {
                name,
                email,
                password,
                pic,
              },
              config
            );
            console.log(data);
            toast({
              title: "Registration Successful",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setPicLoading(false);
            navigate("/chats");
            
          } catch (error) {
            toast({
              title: "Error Occured!",
              description: error.response.data.message,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setPicLoading(false);
          }

    }
    return (
        <VStack spacing='5px'>
            <FormControl id='first-name' isRequired>
                <FormLabel>
                    Name
                </FormLabel>
                <Input placeholder='Enter Your Name' onChange={(e) => setName(e.target.value)} />
            </FormControl>

            <FormControl id='email' isRequired>
                <FormLabel>
                    Email
                </FormLabel>
                <Input placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} />
            </FormControl>

            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Enter Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id="password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Confirm Password"
                        onChange={(e) => setConfirmpassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id="pic">
                <FormLabel>Upload your Picture</FormLabel>
                <Input
                    type="file"
                    p={1.5}
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>

            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={picLoading}
            >
                Sign Up
            </Button>

        </VStack>
    )
}

export default Signup
