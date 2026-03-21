use std::fs;
fn main(){
 let p="/home";
  if let Ok(d)=fs::read_dir(p){
    for f in d{
       let n=f.unwrap().file_name().into_string().unwrap();
          if n.ends_with(".exe")||n.ends_with(".sh"){
              println!("suspeito: {}",n);
                 }else{
                     println!("ok: {}",n);
                        }
                          }
                           }
                           }