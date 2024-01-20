const permittedRoles = ["user", "assistant", "system"];

exports.modifyTranscript = ({
    globals,
    role,
    content
}) => {

    if (permittedRoles.includes(role)) {
        if (globals.mainThread.length === 0 || globals.mainThread[globals.mainThread.length - 1].role !== role) {
            globals.mainThread.push({ role, content });
            return {success: true};
        } else {
            globals.mainThread[globals.mainThread.length - 1].content +=" " + content;
            return {success: true};
        }
    } else {

        return {
            error:"Invalid role, role must be one of: " + permittedRoles.join(", ")+ " but was: " + role, 
            success: false
        };

    }
};
