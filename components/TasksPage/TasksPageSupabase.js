
import { supabase } from "../../lib/supabase"
import { onlyDatesAreSame, getDateFromDatetime, toYMDFormat } from "../../utils/DateHelper"

// export function subscribeToChangesTasksTable(syncLocalWithDb) {
//   const channel = supabase
//   .channel('Tasks')
//   .on(
//     'postgres_changes',
//     {
//       event: 'UPDATE',
//       schema: 'public',
//     },
//     async (payload) => {
//       console.log("detected UPDATE changes!!!")
//       console.log(payload)
// 	await syncLocalWithDb()
//     }
//   )
// .on(
// 	'postgres_changes',
// 	{
// 	  event: 'DELETE',
// 	  schema: 'public',
// 	},
// 	async (payload) => {
// 	  console.log("detected DELETE changes!!!")
// 	  console.log(payload)
// 	  await syncLocalWithDb()
// 	}
//   )
//   .on(
// 	'postgres_changes',
// 	{
// 	  event: 'INSERT',
// 	  schema: 'public',
// 	},
// 	async (payload) => {
// 	  console.log("detected INSERT changes!!!")
// 	  console.log(payload)
// 	  await syncLocalWithDb()
// 	}
//   )

//   .subscribe()


// const habitHistoryChannel = supabase
//   .channel('HabitHistory')
//   .on(
//     'postgres_changes',
//     {
//       event: 'UPDATE',
//       schema: 'public',
//     },
//     async (payload) => {
//       console.log("detected UPDATE changes!!!")
//       console.log(payload)
// 	// await syncLocalWithDb()
//     }
//   )
// .on(
// 	'postgres_changes',
// 	{
// 	  event: 'DELETE',
// 	  schema: 'public',
// 	},
// 	async (payload) => {
// 	  console.log("detected DELETE changes!!!")
// 	  console.log(payload)
// 	  await syncLocalWithDb()
// 	}
//   )
//   .on(
// 	'postgres_changes',
// 	{
// 	  event: 'INSERT',
// 	  schema: 'public',
// 	},
// 	async (payload) => {
// 	  console.log("detected INSERT changes!!!")
// 	  console.log(payload)
// 	  await syncLocalWithDb()
// 	}
//   )

//   .subscribe()
// }

// supabase functions to implement:
// update task settings: DONE
// update habit history entry DONE
// delete task DONE


// local AND supabase changes
export const supabaseUpdateTaskSettings = async (session, updateDict, taskId, setTaskItems, taskItems, setHabitStats, habitHistory) => {


  // find the index of the task in the taskItems array state and create a copy

  const oldTask = taskItems.find(x => x.id == taskId)
  let taskItemsCopy = [...taskItems]
  const index = taskItemsCopy.indexOf(oldTask)

  if (index == -1) {
    console.error("supabaseUpdateTaskSettings: unable to edit task since task is not found in array state")
  }

  // update the required properties of the task based on newTaskSettings and update local states

  for (let [taskProperty, propertyNewValue] of Object.entries(updateDict)) {
    if (!taskItemsCopy[index].hasOwnProperty(taskProperty)) {
      console.error("supabaseUpdateTaskSettings: You're trying to update a property of a task that doesn't exist")
    }
    taskItemsCopy[index][taskProperty] = propertyNewValue
  }

  setTaskItems(taskItemsCopy)

  // local changes above
  // ========================================================================================
  // db changes below

  // copy taskSettings to prevent any unexpected changes

  const updateDictCopy = { ...updateDict }

  // update the id and email keys

  if ("email" in updateDictCopy) {
    updateDictCopy["email"] = session.user.email
  }

  // if ("id" in updateDictCopy) {
  //   delete updateDictCopy["id"]
  // }

  // covnert ALL dates to ISO string before adding to supabase
  if ("dueDate" in updateDictCopy) {
    updateDictCopy["dueDate"] = updateDictCopy["dueDate"].toISOString()
  }

  if (updateDictCopy["habitHistory"] != null) {
    const newhabitHistory = []
    for (const entry of updateDictCopy["habitHistory"]) {
      newhabitHistory.push({ ...entry, exactDueDate: entry["exactDueDate"].toISOString() })
    }
    updateDictCopy["habitHistory"] = newhabitHistory
  }

  if (Object.hasOwn(updateDictCopy, "repeat_days_edited_date")) {
    updateDictCopy.repeat_days_edited_date = updateDictCopy.repeat_days_edited_date.toISOString()
  }


  // update supabase


  // console.log({taskId})  
  const { error } = await supabase
    .from('Tasks')
    .update(updateDictCopy)
    .eq('id', taskId)

  if (error) console.warn(error)

}

// local AND supabase changes
// NOTE: DID NOT ADD LOGIC TO CONVER TO ISO_STRING YET
export const supabaseUpdateHabitHistoryEntry = async (updateDict, taskId, habitHistory, setHabitHistory, habit_due_date, setHabitStats, updateStats = true) => {
  // local changes
  //find the entry that matches the id AND habit_due_date
  // then, update entry based on updateDict
  const habitHistoryCopy = { ...habitHistory }
  for (const entry of habitHistoryCopy[taskId]) {
    if (onlyDatesAreSame(entry.habit_due_date, habit_due_date)) {
      // TODO: add logic to update entry based on updateDict

      for (let [taskProperty, propertyNewValue] of Object.entries(updateDict)) {
        if (!entry.hasOwnProperty(taskProperty)) {
          console.error("supabaseUpdateTaskSettings: You're trying to update a property of a HABIT that doesn't exist")
        }
        entry[taskProperty] = propertyNewValue
      }
      //  entry["status"] = status
    }
  }
  setHabitHistory(habitHistoryCopy)

  // local changes above
  // ========================================================================================
  // db changes below

  // db changes
  const { error } = await supabase
    .from('HabitHistory')
    .update(updateDict)
    .eq('id', taskId)
    .eq('habit_due_date', habit_due_date)

  if (error) console.warn(error)


  if (updateStats) {
    // console.log("updating: "+taskId)
    updateHabitStats(setHabitStats, habitHistoryCopy)
  }


  //  console.log(habitHistory)
}


export const supabaseInsertHabitHistoryEntries = async (entriesToAdd, habitId, habitHistory, setHabitHistory, setHabitStats, updateStats = true, batchSize = 50) => {

  const habitHistoryCopy = { ...habitHistory }

  if (!(habitId in habitHistoryCopy)) {
    habitHistoryCopy[habitId] = []
  }
  habitHistoryCopy[habitId].push(...entriesToAdd)
  setHabitHistory(habitHistoryCopy)

  for (const entry of entriesToAdd) {
    if ("habit_due_date" in entry) {
      entry.habit_due_date = entry.habit_due_date.toISOString()
    }
  }

  // console.log("inserted entry: " + entriesToAdd)

  // update database
  for (let i = 0; i < entriesToAdd.length; i += batchSize) {
    const batch = entriesToAdd.slice(i, i + batchSize)

    const { error } = await supabase
      .from('HabitHistory')
      .insert(batch)

    if (error) console.warn(error)
  }


  if (updateStats) {
    updateHabitStats(setHabitStats, habitHistory)
  }
}


// local AND supabase changes
export const supabaseInsertTask = async (session, newTaskSetting, setTaskItems, taskItems, habitHistory, setHabitHistory, habitStats, setHabitStats) => {
  // console.log({setHabitStats})

  // find the index of the task in the taskItems array state and create a copy


  if (newTaskSetting.isHabit) {
    newTaskSetting["status"] = "pending"
  }


  // We're not updating the state yet because we need to get the id of the newly added task!!
  //  let taskItemsCopy = [...taskItems]
  // taskItemsCopy.push(newTaskSettings)
  // setTaskItems(taskItemsCopy)

  // ========================================================================================
  // db changes below

  // copy taskSettings to prevent any unexpected changes

  const newTaskSettingsCopy = { ...newTaskSetting }

  // update the id and email keys

  newTaskSettingsCopy["email"] = session.user.email

  // if ("id" in newTaskSettingsCopy) {
  //   delete newTaskSettingsCopy["id"]
  // }

  // covnert ALL dates to ISO string before adding to supabase
  if ("dueDate" in newTaskSettingsCopy) {
    newTaskSettingsCopy["dueDate"] = newTaskSettingsCopy["dueDate"].toISOString()
  }

  if (newTaskSettingsCopy["habitHistory"] != null) {
    const newhabitHistory = []
    for (const entry of newTaskSettingsCopy["habitHistory"]) {
      newhabitHistory.push({ ...entry, exactDueDate: entry["exactDueDate"].toISOString() })
    }
    newTaskSettingsCopy["habitHistory"] = newhabitHistory
  }

  if ("repeat_days_edited_date" in newTaskSettingsCopy) {
    newTaskSettingsCopy.repeat_days_edited_date = newTaskSettingsCopy.repeat_days_edited_date.toISOString()
  }

  // update supabase

  console.info({"id": newTaskSettingsCopy.id})

  const { data, error } = await supabase
    .from('Tasks')
    .insert(newTaskSettingsCopy).select().single()
  // console.log(newTaskSettingsCopy)

  if (error) console.warn(error)

  // update local states with taskInfo that contains id
  let taskItemsCopy = [...taskItems]
  newTaskSetting["id"] = data.id
  taskItemsCopy.push(newTaskSetting)
  setTaskItems(taskItemsCopy)

  if (newTaskSetting.isHabit == true) {
    await supabaseFixHistoryAllHabits(taskItemsCopy, habitHistory, setHabitHistory, habitStats, setHabitStats)
  }
}

export const supabaseDeleteTask = async (taskId, isHabit, setTaskItems, taskItems, habitHistory, setHabitHistory) => {

  // update local states
  let taskItemsCopy = [...taskItems]
  taskItemsCopy = taskItemsCopy.filter(item => item.id !== taskId)
  setTaskItems(taskItemsCopy)

  let newHabitHistory
  let updateHabitStats = false
  if (isHabit && (taskId in habitHistory)) {
    newHabitHistory = { ...habitHistory }
    delete newHabitHistory.taskId
    setHabitHistory(newHabitHistory)
    updateHabitStats = true
  }

  // update database
  const { error } = await supabase
    .from('Tasks')
    .delete()
    .eq('id', taskId)

  if (error) {
    console.warn(error)
  }

  if (updateHabitStats) {
    updateHabitStats(setHabitHistory, newHabitHistory)
  }
}

export const supabaseSyncLocalWithDb = async (session, setTaskItems, setHabitStats, setHabitHistory) => {

  const data = await getAllTasks(session)

  // code to update taskItems state

  console.log("NOTE: syncing local states with db")

  // console.log("here is my data :(: "+data)

  let newTaskItems = []
  for (const task of data) {
    task.dueDate = new Date(task.dueDate)

    // update habit history dates (convert from string to date)
    if (task.habitHistory != null) {
      const newhabitHistory = []
      for (const entry of task["habitHistory"]) {
        newhabitHistory.push({ ...entry, exactDueDate: new Date(entry.exactDueDate) })
      }
      task.habitHistory = newhabitHistory
      // console.log({"updating created_at" : task["created_at"]})
    }

    task.repeat_days_edited_date = new Date(task.repeat_days_edited_date)

    newTaskItems = [...newTaskItems, task]
  }

  setTaskItems(newTaskItems)


  // update HabitHistory state
  var newHabitHistory = await getAllHabitHistories(setHabitHistory, newTaskItems)

  // update habit stats state
  updateHabitStats(setHabitStats, newHabitHistory)
}


const getAllHabitHistories = async (setHabitHistory, taskItems) => {

  let newHabitHistory = {}

  for (const task of taskItems) {
    if (task.isHabit) {
      const { data, error } = await supabase
        .from('HabitHistory')
        .select()
        .eq('id', task.id)
        .order('created_at', { ascending: false })
      if (error) console.warn(error)
      newHabitHistory[task.id] = data
    }
  }
  setHabitHistory(newHabitHistory)

  return newHabitHistory

  // console.log(JSON.stringify(newHabitHistory, undefined, 2))

}

// helper function

const findEntryWithDate = (habitHistoryEntries, myDate) => {
  if (habitHistoryEntries == undefined) return -1

  console.log({ habitHistoryEntries })
  for (let entry of habitHistoryEntries) {
    // found a match, return entry
    if (onlyDatesAreSame(new Date(entry["habit_due_date"]), myDate)) {
      return entry;
    }
  }
  // No match found
  return -1;

}


// call this function when: habit is added and when page loads
const supabaseFixHistoryAllHabits = async (taskItems, habitHistory, setHabitHistory, habitStats, setHabitStats) => {
  // const { data, error } = await supabase
  // .from('Tasks')
  // .select()
  // .eq('isHabit', true)
  // .order('created_at', { ascending: true })

  for (var habitSettings of taskItems) {
    if (habitSettings.isHabit == true) {
      await supabaseFixHistoryForSingleHabit(habitSettings, habitSettings.id, habitHistory, setHabitHistory, setHabitStats)
    }
  }
  // }
}


export const supabaseFixHistoryForSingleHabit = async (habitSettings, habitId, habitHistory, setHabitHistory, setHabitStats) => {
  console.log("===============================")
  // possibility of missing some habits
  // repeatDays last edited date -> current date

  // create a list of dates between habit's repeat_days_edited_date and today that are all valid dates for the habit
  const now = getDateFromDatetime(new Date())
  var dayAfterNow = new Date(now)
  dayAfterNow.setDate(dayAfterNow.getDate() + 1)

  var datesToCheck = [];
  var newEntries = []
  var updateEntries = []
  const start_date = getDateFromDatetime(new Date(habitSettings.repeat_days_edited_date))
  for (var d = start_date; d < dayAfterNow; d.setDate(d.getDate() + 1)) {
    if (habitSettings["repeatDays"][(d.getDay() + 6) % 7] == true) datesToCheck.push(new Date(d));
  }
  console.log({ daysToCheck: datesToCheck, "id": habitSettings["id"] })

  for (var i = 0; i < datesToCheck.length; i += 1) {
    const selectedDate = datesToCheck[i]
    const selectedEntry = findEntryWithDate(habitHistory[habitId], selectedDate)

    // if entry with selected date does not exist, add entry
    if (selectedEntry == -1) {
      var status
      if (onlyDatesAreSame(selectedDate, now)) {
        status = "pending"
      } else {
        status = "incomplete"
      }

      const other = new Date(habitSettings["dueDate"])
      const habit_due_date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(),
        other.getHours(), other.getMinutes(), other.getSeconds(), other.getMilliseconds())

      newEntries.push({
        "habit_due_date": habit_due_date,
        "status": status,
        // "is_streak": false, // not needed anymore!
        "id": habitId,
      })
    }

    // if entry does exist for this date (given bcuz else if)
    else if (selectedEntry["status"] == "pending" // & is "pending"
      && !(onlyDatesAreSame(new Date(selectedEntry["habit_due_date"]), now)) // & habit_due_date != today:
    ) {
      // update entry
      updateEntries.push({ status: "incomplete", id: selectedEntry["id"], habit_due_date: selectedEntry["habit_due_date"] })
    }
  }


  if (newEntries || updateEntries) {

    if (newEntries) {
      await supabaseInsertHabitHistoryEntries(newEntries, habitId, habitHistory, setHabitHistory, setHabitStats, false)
    }
    if (updateEntries) {
      for (const entry of updateEntries) {
        await supabaseUpdateHabitHistoryEntry(entry, habitId, habitHistory, setHabitHistory, entry.habit_due_date, setHabitStats, setHabitStats)
      }
    }

    updateHabitStats(setHabitStats, habitHistory)
  }
}

// updates the habitHistory state with all the habit histories that are associated with ALL the habits that have been loaded into the app 
// format of habitHistory state:
// dictionary in which:
// key = habit's id
// value = list of habit history entries associated with that id 
// NOTE: habit histories are sorted in descending order
// ideally subscribe to individual changes for more efficiency, but this works for now:
// when task is added
// when task is removed
// when task is edited


// no
const updateHabitStats = (setHabitStats, newHabitHistory) => {


  console.log("hi")

  // console.log(newHabitHistory)

  let newHabitStats = {}

  for (const [habitId, habitEntriesArray] of Object.entries(newHabitHistory)) {

    habitEntriesArray.sort((a, b) => new Date(b.habit_due_date) - new Date(a.habit_due_date));

    let streak = 0
    let history = {}
    let datesDue = []

    // get latest streak count
    for (const historyEntry of habitEntriesArray) {
      if (historyEntry.status == "incomplete") break;
      else if (historyEntry.status == "complete") streak += 1;
    }

    // update history array
    for (const historyEntry of habitEntriesArray) {
      history[historyEntry.habit_due_date] = historyEntry.status
      // if (historyEntry.status == "incomplete") history.push(0);
      // else if (historyEntry.status == "complete") history.push(1);
      // else if (historyEntry.status == "exempt") history.push(-1);
      // else console.warn("history status is NOT the required format. This may cause problems")
      // datesDue.push(historyEntry.habit_due_date)
    }

    // update streak count
    newHabitStats[habitId] = { "streak": streak, "history": history}
  }

  // console.log(JSON.stringify(newHabitStats, null, 2))

  // console.log(JSON.stringify(newHabitStats, undefined, 2))

  setHabitStats(newHabitStats)
  return newHabitStats

}


export const getAllTasksForMonth = (month, year, taskItems) => {
  let selectedTasks = taskItems.filter(item => {
    // Parse dueDate to extract month and year
    let dueDate = new Date(item.dueDate);
    let dueMonth = dueDate.getMonth() + 1; // getMonth() returns 0-indexed month
    let dueYear = dueDate.getFullYear();

    // Check if month is February (2) and year is 2024
    return dueMonth === month && dueYear === year && item.isHabit == false;
  })
  .map(item => {
    return {
      dueDate: toYMDFormat(item.dueDate),
      name: item.name,
      duration: item.duration,
      importance: item.importance,
      status: item.status
    };
  });  
  
  ;

  console.log(JSON.stringify(selectedTasks, null, 2))

}




export const getAllTasks = async (session) => {
  const { data, error } = await supabase
    .from('Tasks')
    .select()
    .eq('email', session.user.email)
    .order('created_at', { ascending: true })

  // console.log({data})

  if (error) console.warn(error)
  return data
}

