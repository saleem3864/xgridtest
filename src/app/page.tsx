"use client";
import Image from "next/image";
import { userInfo } from "os";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [dataFilter, setFilter] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [paginatedData, setPaginatedData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [selectedPost, setSelectedPost] = useState();

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

  useEffect(() => {
    setTotalPages(dataFilter.length / 10);
    setActivePage(1);
  }, [dataFilter]);

  useEffect(() => {
    setPaginatedData(
      dataFilter.slice(
        activePage == 1 ? 0 : activePage * 10,
        (activePage + (activePage == 1 ? 0 : 1)) * 10
      )
    );
  }, [dataFilter, activePage]);

  console.log(data);

  return (
    <main className="">
      <div style={{ position: "absolute", width: "100%" }}>
        <center>
          Search By Title
          <input
            style={{ border: "1px solid black", color: "black" }}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
          <br />
          total pages: {totalPages}
          <br />
          active page: {activePage}
          <br />
          <button
            disabled={activePage === totalPages}
            onClick={() => {
              setActivePage(activePage + 1);
            }}
            style={{ backgroundColor: "white", width: 100, color: "black" }}
          >
            next
          </button>
        </center>
        {data?.length > 0 && (
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
              <th style={{ width: 1 }}>Show Details</th>
            </tr>

            {paginatedData?.map((value, index) => {
              return (
                <tr>
                  <th style={{ width: 1 }}>{value?.userId}</th>
                  <th style={{ width: 1 }}>{value?.id}</th>
                  <th style={{ width: 1 }}>{value?.title}</th>
                  <th style={{ width: 1 }}>{value?.body}</th>
                  <th style={{ width: 1 }}>{value?.userInfo?.name}</th>
                  <th style={{ width: 1 }}>{value?.userInfo?.username}</th>
                  <th style={{ width: 1 }}>{value?.userInfo?.email}</th>
                  <th style={{ width: 1 }}>
                    {value?.userInfo?.address?.street}
                  </th>
                  <th style={{ width: 1 }}>{value?.userInfo?.phone}</th>
                  <th style={{ width: 1 }}>{value?.userInfo?.website}</th>
                  <th style={{ width: 1 }}>{value?.userInfo?.company?.name}</th>
                  <th style={{ width: 1 }}>
                    <button
                      onClick={() => {
                        setSelectedPost(value);
                      }}
                      style={{
                        backgroundColor: "white",
                        width: 100,
                        color: "black",
                      }}
                    >
                      Show
                    </button>
                  </th>
                </tr>
              );
            })}
          </table>
        )}
        {data?.length == 0 && (
          <center style={{ marginTop: 200 }}>LOADING... PLEASE WAIT</center>
        )}
      </div>
      {selectedPost && (
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "40%",
            backgroundColor: "White",
            width: 400,
            height: 500,
          }}
        >
          <center>
            <p style={{ color: "black " }}>NO TIME HENCE SHOWIING JSON</p>
            <p style={{ color: "black " }}>{JSON.stringify(selectedPost)}</p>

            <button
              onClick={() => {
                setSelectedPost(undefined);
              }}
              style={{
                backgroundColor: "black",
                width: 100,
                color: "white",
                marginTop: 10,
              }}
            >
              hide
            </button>
          </center>
        </div>
      )}
    </main>
  );
}
