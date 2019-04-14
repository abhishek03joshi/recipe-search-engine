import uniqid from 'uniqid';

export default class List {
    constructor(){
        this.items = [];
    }

    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id == id);
        //splice mutates the orginal array but slice() does not mutate the original array
        // [2,4,8] splice(1, 1) (start index, number of elements from the start index) -> returns 4 and the original arry -> [2,8]
        // [2,4,8] splice(1, 2) -> returns 4 and 8 and the original arry -> [2]
        // [2,4,8] slice(1, 1) (start and end index) -> returns nothing and the original arry -> [2,4,8]
        // [2,4,8] slice(1, 2) (start and end index) -> returns 4 and the original arry -> [2,4,8]
        this.items.splice(index, 1); 
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id = id).count = newCount;
    }
}