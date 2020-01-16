exports.GetTopicActionId = function(topic) {
    var validTopicList = ['action', 'getStatus', 'retStatus'];
    
    if (topic.includes(validTopicList[0]))
        return 1;
    if (topic.includes(validTopicList[1]))
        return 2;
    if (topic.includes(validTopicList[2]))
        return 3;
    
    return 0;
}

exports.IsValidTopicAction = function(topic) {
    var validTopicList = ['action', 'getStatus', 'retStatus'];
    
    if (topic.includes(validTopicList[0]))
        return true;
    if (topic.includes(validTopicList[1]))
        return true;
    if (topic.includes(validTopicList[2]))
        return true;
    
    return false;
}