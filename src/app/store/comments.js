import { createSlice } from "@reduxjs/toolkit";
import commentService from "../services/comment.service";

const commentsSlice = createSlice({
    name: "comments",
    initialState: {
        entities: null,
        isLoading: true,
        error: null
    },
    reducers: {
        commentsRequested: (state) => {
            state.isLoading = true;
        },
        commentsReceived: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
        },
        commentsRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        commentsChanged: (state, action) => {
            state.isLoading = false;
            if (!Array.isArray(state.entities)) {
                state.entities = [];
            }
            state.entities.push(action.payload);
        },
        commentRemoved: (state, action) => {
            state.isLoading = false;
            state.entities = state.entities.filter(
                (c) => c._id !== action.payload
            );
        }
    }
});

const { reducer: commentsReducer, actions } = commentsSlice;
const {
    commentsRequested,
    commentsReceived,
    commentsRequestFailed,
    commentsChanged,
    commentRemoved
} = actions;

export const loadCommentsList = (userId) => async (dispatch) => {
    dispatch(commentsRequested());
    try {
        const { content } = await commentService.getComments(userId);
        dispatch(commentsReceived(content));
    } catch (error) {
        dispatch(commentsRequestFailed(error.message));
    }
};

export function createComment(payload) {
    return async function (dispatch) {
        dispatch(commentsRequested());
        try {
            const { content } = await commentService.createComment(payload);
            dispatch(commentsChanged(content));
        } catch (error) {
            dispatch(commentsRequestFailed(error.message));
        }
    };
}

export function removeComment(id) {
    return async function (dispatch) {
        dispatch(commentsRequested());
        try {
            const { content } = await commentService.removeComment(id);
            if (content === null) dispatch(commentRemoved(id));
        } catch (error) {
            dispatch(commentsRequestFailed(error.message));
        }
    };
}

export const getComments = () => (state) => state.comments.entities;
export const getCommentsLoadingStatus = () => (state) =>
    state.comments.isLoading;

export default commentsReducer;
