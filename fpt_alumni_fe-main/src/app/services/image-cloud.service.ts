import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, finalize, forkJoin, from, map, switchMap } from 'rxjs';
// import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root'
})
export class ImageCloudService {

  constructor(private storage: AngularFireStorage) {}

  uploadImage(file: File, filePath: string): Observable<string | undefined> {
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    return task.snapshotChanges().pipe(
      finalize(() => {
        return fileRef.getDownloadURL();
      }),
      switchMap(() => {
        return fileRef.getDownloadURL();
      })
    );
  }

  uploadFiles(files: File[]): Observable<string[]> {
    const uploadTasks: Observable<string>[] = files.map(file => {
      const filePath = `images/postImage/${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      return new Observable<string>(observer => {
        task.snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(url => {
              observer.next(url);
              observer.complete();
            });
          })
        ).subscribe();
      });
    });

    return forkJoin(uploadTasks);
  }

  // uploadImages(files: File[]): Observable<string[]> {
  //   const uploadTasks: Observable<string>[] = [];

  //   files.forEach((file) => {
  //     const filePath = `images/${Date.now()}_${file.name}`;
  //     const fileRef = this.storage.ref(filePath);
  //     const task = this.storage.upload(filePath, file);

  //     const task$ = task.snapshotChanges().pipe(
  //       finalize(() => {}),
  //       map(() => {
  //         return fileRef.getDownloadURL().toPromise(); // Convert Observable to Promise
  //       })
  //     );

  //     uploadTasks.push(task$);
  //   });

  //   return forkJoin(uploadTasks);
  // }

  getImageUrl(filePath: string): Observable<string> {
    const fileRef = this.storage.ref(filePath);
    return fileRef.getDownloadURL();
  }

  deleteImage(filePath: string): Observable<void> {
    const fileRef = this.storage.ref(filePath);
    return fileRef.delete();
  }

  updateImage(file: File, filePath: string): Observable<number | undefined> {
    const fileRef = this.storage.ref(filePath);
    const task = fileRef.put(file);
    return task.percentageChanges();
  }
}
