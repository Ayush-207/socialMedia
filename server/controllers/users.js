import User from "../models/User.js"

// READ
export const getUsers = async (req, res) => {
    try {
        console.log('getUsers');
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        const friends = await User.find({ _id: { $in: user.friends } });

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        )

        res.status(200).json(formattedFriends);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// UPDATE 

export const addRemoveFriend = async (req, res) => {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    if (user.friends.includes(friendId)) {
        user.friends.filter((idd) => idd !== friendId);
        friend.friends.filter((idd) => idd !== id);
    }
    else {
        user.friends.push(friendId);
        friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    const friends = await Promise.all(
        user.friends.map((id) => User.findById(id))
    )

    const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return { _id, firstName, lastName, occupation, location, picturePath };
        }
    )

    res.status(200).json(formattedFriends);
}