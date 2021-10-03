const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const uri =
  "mongodb+srv://Demo:DemoPass@cluster0.c0afe.mongodb.net/myTasks?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const dbPath = client.db("MyTasks").collection("Tasks");

async function main() {
  try {
    await client.connect();
    await createMultipleList(client, [
      {
        Description: "Task 1",
        Completed: true,
      },
      {
        Description: "Task 2",
        Completed: false,
      },
      {
        Description: "Task 3",
        Completed: true,
      },
      {
        Description: "Task 4",
        Completed: false,
      },
    ]);
    await findListByName(client);
    await UpdateTasks(client);
    await deleteListOne(client, ""); //add any id you wish to delete inside the quotes
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}
main().catch(console.error);

async function deleteListOne(client, id) {
  const result = await dbPath.deleteOne({ _id: ObjectId(id) });
  console.log(`\n${result.deletedCount} document(s) was/were deleted\n`);
}

async function UpdateTasks(client) {
  const result = await dbPath.updateMany(
    { Completed: false },
    { $set: { Completed: true } }
  );
  console.log(
    `\n${result.matchedCount} document(s) matched the query criteria.`
  );
  console.log(`${result.modifiedCount} document(s) was/were updated.\n`);
}

async function findListByName(client) {
  const cursor = await dbPath.find({ Completed: false });
  const results = await cursor.toArray();
  if (results.length > 0) {
    console.log("Required Documents:");
    results.forEach((res) => {
      console.log();
      console.log(` - Description: ${res.Description}`);
      console.log(` - Completed: ${res.Completed}`);
    });
  }
}

async function createMultipleList(client, newLists) {
  const result = await dbPath.insertMany(newLists);
  console.log(`Document Insert count: ${result.insertedCount}\n`);
  console.log(result.insertedIds);
  console.log();
}
