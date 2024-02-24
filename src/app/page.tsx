"use client";
import Image from "next/image";
import { userInfo } from "os";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [dataFilter, setFilter] = useState([]);
  const [searchText, setSearchText] = useState("");

  function fecthUser(userid: string) {
    return new Promise((resolve, reject) => {
      fetch(`https://jsonplaceholder.typicode.com/users/${userid}`)
        .then((data: Response) => {
          console.log(
            data.json().then((jsonData) => {
              resolve(jsonData);
            })
          );
        })
        .catch(reject);
    });
  }

  async function fetchPosts() {
    fetch("https://jsonplaceholder.typicode.com/posts").then(
      async (data: Response) => {
        console.log(
          data.json().then(async (jsonData) => {
            for (var index = 0; index <= jsonData.length - 1; index++) {
              var value = jsonData[index];
              const user = await fecthUser(value?.userId);
              value.userInfo = user;
              jsonData[index] = value;
              console.log("setting json");
            }
            setData(jsonData);
          })
        );
      }
    );
  }
  useEffect(() => {
    fetchPosts();
  }, []);

  function filterByTitle(data, text) {
    return data?.filter((filter) => filter?.title === text);
  }

  useEffect(() => {
    if (searchText === "") setFilter(data);
    else setFilter(filterByTitle(data, searchText));
  }, [data, searchText]);

  console.log(data);
  return (
    <main className="">
      <div>
        <center>
          Search By Title
          <input
            style={{ border: "1px solid black", color: "black" }}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
        </center>
        <table style={{ width: "100%" }}>
          <tr>
            <th style={{ width: 1 }}>USER ID</th>
            <th style={{ width: 1 }}>POST ID</th>
            <th style={{ width: 1 }}>TITLE</th>
            <th style={{ width: 1 }}>Body</th>
            <th style={{ width: 1 }}>Name</th>
            <th style={{ width: 1 }}>Username</th>
            <th style={{ width: 1 }}>Email</th>
            <th style={{ width: 1 }}>Address</th>
            <th style={{ width: 1 }}>Phone</th>
            <th style={{ width: 1 }}>Website</th>
            <th style={{ width: 1 }}>Company</th>
            <th style={{ width: 1 }}>Edit</th>
          </tr>

          {dataFilter?.map((value, index) => {
            return (
              <tr>
                <th style={{ width: 1 }}>{value?.userId}</th>
                <th style={{ width: 1 }}>{value?.id}</th>
                <th style={{ width: 1 }}>{value?.title}</th>
                <th style={{ width: 1 }}>{value?.body}</th>
                <th style={{ width: 1 }}>{value?.userInfo?.name}</th>
                <th style={{ width: 1 }}>{value?.userInfo?.username}</th>
                <th style={{ width: 1 }}>{value?.userInfo?.email}</th>
                <th style={{ width: 1 }}>{value?.userInfo?.address?.street}</th>
                <th style={{ width: 1 }}>{value?.userInfo?.phone}</th>
                <th style={{ width: 1 }}>{value?.userInfo?.website}</th>
                <th style={{ width: 1 }}>{value?.userInfo?.company?.name}</th>
                <th style={{ width: 1 }}>Edit</th>
              </tr>
            );
          })}
        </table>
      </div>
    </main>
  );
}
