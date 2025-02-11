const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
const url = "mongodb://127.0.0.1:27017";

const createDB = async () => {
  try {
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db("simpleTodo");
    return { db, client };
  } catch (error) {
    throw error;
  }
};

// add todo item
exports.add = async (taskdata) => {
  try {
    const { db, client } = await createDB();
    const addRes = await db.collection("todos").insertOne(taskdata);
    client.close();
    if (addRes.acknowledged) {
      return {
        status_code: 200,
        message: "Inserted Data Successfully",
      };
    } else {
      return {
        status_code: 500,
        message: "Internal server error !",
      };
    }
  } catch (error) {
    throw error;
  }
};

// display & find todo item
exports.findTodo = async () => {
  try {
    const { db, client } = await createDB();
    const findRes = await db.collection("todos").find().toArray();
    client.close();
    if (findRes.length != 0) {
      return {
        status_code: 200,
        data: findRes,
      };
    } else {
      return {
        status_code: 500,
        data: findRes,
      };
    }
  } catch (error) {
    throw error;
  }
};

// update todo item
exports.updateTodo = async (id, updateInfo) => {
  try {
    const { db, client } = await createDB();
    const updateRes = await db
      .collection('todos')
      .updateOne({ _id: new ObjectId(id) }, { $set: updateInfo });
    client.close();

    if (updateRes.acknowledged && updateRes.modifiedCount > 0) {
      return {
        status_code: 201,
        data: updateRes,
        message: "Data updated successfully!",
      };
    }else if (updateRes.matchedCount === 0) {
        return {
          status_code: 404,
          message: "No matching document found to update.",
        };
      } else {
      return {
        status_code: 500,
        message: "Failed to update the document.",
      };
    }
  } catch (error) {
    console.error("Error in updateTodo:", error);
    throw error;
  }
};


// delete todo item
exports.deleteTodo = async (id) => {
    try {
        const { db, client } = await createDB();
    const deleteRes = await db.collection("todos").deleteOne({ _id: new ObjectId(id) });
    client.close();
    console.log(deleteRes);
    if (deleteRes.deletedCount > 0) {
        return {
          status_code: 200,
          message: "Todo deleted successfully!",
        };
      } else {
        return {
          status_code: 404,
          message: "Todo not found. Deletion failed!",
        };
      }
    } catch (error) {
        throw error
    }
}