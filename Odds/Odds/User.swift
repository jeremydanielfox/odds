//
//  User.swift
//  Odds
//
//  Created by Eric Saba on 11/9/16.
//  Copyright © 2016 Eric Saba. All rights reserved.
//

import UIKit
import CoreData

class User: NSObject {
    private var uid: Int
    private var name: String
    private var cred: Int
    //private var profilePic; //not sure if this should change
    
    init(uid: Int, name: String, cred: Int) {
        self.uid = uid
        self.name = name
        self.cred = cred
    }
    
    override func isEqual(_ object: Any?) -> Bool {
        if let object = object as? User {
            return self.uid == object.uid
        }
        else {
            return false
        }
    }
    
    func hasUniqueID(uid: Int) -> Bool{
        if uid == self.uid {return true}
        else {return false}
    }
    
    func getUID() -> String {
        return String(uid)
    }
    
    func getName() -> String {
        return name
    }
    
    func updateName(newName: String) -> Bool{
        //implement
        return false
    }
    
    func getCred() -> Int {
        return cred
    }
    
    func updateCred(newCred: Int) -> Bool {
        //implement
        return false
    }
    
    func getContext() -> NSManagedObjectContext {
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        return appDelegate.persistentContainer.viewContext
    }
    
    /* CORE DATA METHODS
     static func getCurrentUser() -> User {
     let fetchRequest: NSFetchRequest<Odds> = Odds.fetchRequest()
     let appDelegate = UIApplication.shared.delegate as! AppDelegate
     let context = appDelegate.persistentContainer.viewContext
     
     var uid: Int = 0
     var name: String = ""
     var cred: Int = 0
     do {
     //go get the results
     let searchResults = try context.fetch(fetchRequest)
     
     //I like to check the size of the returned results!
     print ("num of results = \(searchResults.count)")
     
     //You need to convert to NSManagedObject to use 'for' loops
     
     for vals in searchResults as [NSManagedObject] {
     //get the Key Value pairs (although there may be a better way to do that...
     print(vals)
     }
     } catch {
     print("Error with request: \(error)")
     return User(uid: 0, name: "", cred: 0)
     }
     return User(uid: uid, name: name, cred: cred)
     }
     
     static func saveCurrentUser() -> Bool{
     let appDelegate = UIApplication.shared.delegate as! AppDelegate
     let context = appDelegate.persistentContainer.viewContext
     
     let entity =  NSEntityDescription.entity(forEntityName: "Odds", in: context)
     
     let user = NSManagedObject(entity: entity!, insertInto: context)
     
     //set the entity values
     user.setValue("Eric", forKey: "name")
     user.setValue("10", forKey: "uid")
     user.setValue("20", forKey: "cred")
     
     //save the object
     do {
     try context.save()
     print("saved!")
     return true
     } catch let error as NSError  {
     print("Could not save \(error), \(error.userInfo)")
     return false
     } catch {
     return false
     }
     }
     */

}
