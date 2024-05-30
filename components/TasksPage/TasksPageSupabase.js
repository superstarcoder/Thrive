
export function subscribeToChangesTasksTable(supabase, syncLocalWithDb) {
    const channel = supabase
    .channel('Tasks')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
      },
      async (payload) => {
        console.log("detected UPDATE changes!!!")
        console.log(payload)
		await syncLocalWithDb()
      }
    )
	.on(
		'postgres_changes',
		{
		  event: 'DELETE',
		  schema: 'public',
		},
		async (payload) => {
		  console.log("detected DELETE changes!!!")
		  console.log(payload)
		  await syncLocalWithDb()
		}
	  )
	  .on(
		'postgres_changes',
		{
		  event: 'INSERT',
		  schema: 'public',
		},
		async (payload) => {
		  console.log("detected INSERT changes!!!")
		  console.log(payload)
		  await syncLocalWithDb()
		}
	  )
	  
    .subscribe()


	const habitHistoryChannel = supabase
    .channel('HabitHistory')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
      },
      async (payload) => {
        console.log("detected UPDATE changes!!!")
        console.log(payload)
		await syncLocalWithDb()
      }
    )
	.on(
		'postgres_changes',
		{
		  event: 'DELETE',
		  schema: 'public',
		},
		async (payload) => {
		  console.log("detected DELETE changes!!!")
		  console.log(payload)
		  await syncLocalWithDb()
		}
	  )
	  .on(
		'postgres_changes',
		{
		  event: 'INSERT',
		  schema: 'public',
		},
		async (payload) => {
		  console.log("detected INSERT changes!!!")
		  console.log(payload)
		  await syncLocalWithDb()
		}
	  )
	  
    .subscribe()
  }

  export const supabaseSyncLocalWithDb = async (supabase, session, setTaskItems, setHabitStats, setHabitHistory) => {

    const data = await getAllTasks(supabase, session)

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
    var newHabitHistory = await getAllHabitHistories(supabase, setHabitHistory, newTaskItems)

    // update habit stats state
    updateHabitStats(setHabitStats, newHabitHistory) 
  }

    
  const getAllHabitHistories = async (supabase, setHabitHistory, taskItems) => {

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


  const updateHabitStats = async (setHabitStats, newHabitHistory) => {

    let newHabitStats = {}

    for (const [habitId, habitEntriesArray] of Object.entries(newHabitHistory)) {

      let streak = 0
      let history = []

      // get latest streak count
      for (const historyEntry of habitEntriesArray) {
        if (historyEntry.status == "incomplete") break;
        else if (historyEntry.status == "complete") streak += 1;
      }

      // update history array
      for (const historyEntry of habitEntriesArray) {
        if (historyEntry.status == "incomplete") history.push(0);
        else if (historyEntry.status == "complete") history.push(1);
        else if (historyEntry.status == "exempt") history.push(-1);
      }

      // update streak count
      newHabitStats[habitId] = {"streak" : streak, "history" :history}
    }

    console.log(JSON.stringify(newHabitStats, undefined, 2))

    setHabitStats(newHabitStats)
    return newHabitStats

  }

  export const getAllTasks = async (supabase, session) => {
    const { data, error } = await supabase
    .from('Tasks')
    .select()
    .eq('email', session.user.email)
    .order('created_at', { ascending: true })

    if (error) console.warn(error)
    return data
  }

  