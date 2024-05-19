function cleanHeadMovements(data) {
    // Helper function to process each pair
    function processPair(arr, index1, index2) {
      if (Math.abs(arr[index1]) > Math.abs(arr[index2])) {
        arr[index1] -= arr[index2];
        arr[index2] = 0;
      } else {
        arr[index2] -= arr[index1];
        arr[index1] = 0;
      }
    }
  
    // Iterate through each object in the array
    data.forEach(item => {
      const { targets } = item;
  
      if (targets.length !== 6) {
        throw new Error('Each targets list must have exactly 6 elements.');
      }
  
      // Process the specified pairs of indices
      processPair(targets, 0, 1);
      processPair(targets, 2, 3);
      processPair(targets, 3, 4);
    });
  
    return data;
  }
  
  

  