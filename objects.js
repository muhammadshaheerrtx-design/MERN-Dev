const fs = require("fs");

let user = {
  profile: {
    userName: "The_guy",
    age: 32,
    bio: "I am the guy and i want to disintegrate into a the soup of nothingness",
    address: { city: "new York", country: "USA" },
  },
  posts: [
    {
      id: "p_1",
      type: "video",
      captions: "nothing to see",
      likes: 1,
      datePosted: "27/01/2026",
    },
    {
      id: "p_1",
      type: "video",
      captions: "nothing to hear",
      likes: 23,
      datePosted: "29/01/2026",
    },
    {
      id: "p_2",
      type: "video",
      captions: "nothing to fathom",
      likes: 1999,
      datePosted: "11/05/2026",
    },
    {
      id: "p_3",
      type: "picture",
      captions: "a sea of life",
      likes: 1000000,
      datePosted: "22/07/2026",
    },
    {
      id: "p_4",
      type: "picture",
      captions: "The grandest of the grand finale",
      likes: 1,
      datePosted: "10/12/2026",
    },
  ],
};

// Reference vs value
const sameUserRef = user;
sameUserRef.profile.userName = "The_guy_renamed";
console.log(
  "original changed with changes in reference :",
  user.profile.userName,
);
user.profile.userName = "The_guy";

// Destructuring
const { userName: handle, bio, email = "no email on file" } = user.profile;
console.log("Destructured profile fields:", handle, " ", email);

const {
  profile: {
    address: { city, country },
  },
} = user;
console.log("Nested destructured location:", city, country);

const [firstPost, secondPost, ...remainingPosts] = user.posts;
console.log("First post caption:", firstPost.captions);
console.log("Remaining posts count:", remainingPosts.length);

// Spread/rest — immutable update
const updatedUser = {
  ...user,
  profile: {
    ...user.profile,
    bio: "Just here posting videos and pictures.",
  },
};
console.log("Original bio unchanged:", user.profile.bio);
console.log("Updated bio:", updatedUser.profile.bio);

const { posts, ...profileOnly } = user;
console.log("profileOnly keys:", Object.keys(profileOnly));

// Shallow copy pitfall
const shallowCopy = { ...user };
shallowCopy.profile.age = 999;
console.log(
  "Shallow copy pitfall — original age also changed:",
  user.profile.age,
);
user.profile.age = 32;

// Reshape posts
const mostLikedPost = [...user.posts].sort((a, b) => b.likes - a.likes)[0];
console.log(
  "Most liked post:",
  mostLikedPost.captions,
  "-",
  mostLikedPost.likes,
  "likes",
);

const videoPosts = user.posts.filter((p) => p.type === "video");
console.log(
  "Video post captions:",
  videoPosts.map((p) => p.captions),
);

// JSON
const userJson = JSON.stringify(user, null, 2);
console.log("Stringified user :", userJson.slice(0, 100), "...");

const parsedUser = JSON.parse(userJson);
console.log("Parsed back — city survived?", parsedUser.profile.address.city);

fs.writeFileSync("user.json", userJson);
console.log("Saved user.json to disk.");

// Optional chaining / nullish coalescing
console.log("City via optional chaining:", user.profile?.address?.city);
console.log("Zip code:", user.profile?.address?.zipCode);
console.log("Employer name:", user.profile?.employment?.company?.name);

const firstPostLikes = user.posts[0]?.likes ?? 0;
console.log("First post likes (real value, not a fallback):", firstPostLikes);

const zip = user.profile?.address?.zipCode ?? "not provided";
console.log("Zip with fallback:", zip);

const zeroLikesExample = 0;
console.log("|| would wrongly replace 0:", zeroLikesExample || "fallback text");
console.log("?? correctly keeps 0:", zeroLikesExample ?? "fallback text");
